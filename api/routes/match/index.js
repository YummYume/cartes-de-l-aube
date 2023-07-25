import { keysRemover, shuffleArray } from '../../lib/utils.js';
import { Match } from '../../mongoose/models/Match.js';
import { Operator } from '../../mongoose/models/Operator.js';
import { MatchHistory } from '../../typeorm/models/MatchHistory.js';
import { MatchHistoryPlayer } from '../../typeorm/models/MatchHistoryPlayer.js';
import { User } from '../../typeorm/models/User.js';

/**
 * @typedef {{ user: Omit<User, "orundum" | "rankingPoints" | "password" | "operators">, ws: SocketStream }} WsUser
 */

/**
 * @type {WsUser[]}
 */
let waitingRooms = [];

/**
 * @type {{ [key: number]: string }}
 */
let usersMatch = {};

/**
 * @type {{ [key: string]: {
 *    playerTurn: number,
 *    totalTurn: number,
 *    battlefield: string[],
 *    timerTurn: { time: number, stop: () => void, pause: () => void, interval: NodeJS.Timeout },
 *    timerSurrender: { time: number, stop: () => void, pause: () => void, interval: NodeJS.Timeout },
 *    timerPreparation: { time: number, stop: () => void, pause: () => void, interval: NodeJS.Timeout },
 *    players: {
 *      [key: string]: {
 *        user: {
 *          id: number,
 *          username: string,
 *          image: string,
 *          hand: string[],
 *          deck: string[],
 *        },
 *        ws: SocketStream
 *      }
 *    }
 *  }
 * }}
 */
const matchs = {};

const GAIN = {
  rankingPoints: {
    winner: 20,
    loser: -20,
    abandon: -10,
  },
  orundum: {
    winner: 300,
    loser: 50,
    abandon: 0,
  },
};

const TIMER = {
  turn: 0.5 * 60 + 1,
  surrender: 0.5 * 60 + 1, // 1.5 * 60 + 1,
  preparation: 60 + 1,
};

const ACTION_TYPE = {
  running: 'running',
  victory: 'victory',
  defeat: 'defeat',
  surrender: 'surrender',
  timerTurn: 'timer-turn',
  timerSurrender: 'timer-surrender',
  timerPreparation: 'timer-preparation',
  opponentLeft: 'opponent-left',
  error: 'error',
  waiting: 'waiting',
};

// =============[Utils]================ //

/**
 * @param {string[]} cards
 * @returns {{ deck: string[], hand: Operator[] }}
 */
const getHand = async (cards) => {
  const hand = await Operator.find({ name: { $in: cards } })
    .sort('statistics.cost')
    .limit(3)
    .exec();

  const handByName = hand.map(({ name }) => name);

  return {
    hand,
    deck: shuffleArray(cards.filter((name) => !handByName.includes(name))),
  };
};

/**
 * Create an action message
 * @param {keyof typeof ACTION_TYPE} action
 * @param {{}| string} data
 * @returns {string}
 */
const actionMaker = (action, data) =>
  JSON.stringify({ type: action, ...(typeof data === 'string' ? { message: data } : data) });

/**
 * Action messages
 * @type {{ [key in keyof typeof ACTION_TYPE]: (data: string|{}) => { type: key, message?: string, [key: string]: any } }}
 */
const action = Object.keys(ACTION_TYPE).reduce(
  (acc, curr) => ({ ...acc, [curr]: (data) => actionMaker(ACTION_TYPE[curr], data) }),
  {}
);

// Send data to all players in a match
const broadcast = (matchId, data) => {
  const match = matchs[matchId];

  Object.keys(match.players).forEach((key) => {
    const opponentKey = Object.keys(match.players).find((k) => k !== key);
    match.players[key].ws.send(
      JSON.stringify({
        ...data,
        user: match.players[key].user,
        opponent: {
          username: match.players[opponentKey].user.username,
          image: match.players[opponentKey].user.image,
          hand: match.players[opponentKey].user.hand.length,
        },
      })
    );
  });
};

/**
 *
 * @param {string} matchId
 * @param {string} data
 */
const sendToPlayers = (matchId, data) => {
  Object.keys(matchs[matchId].players).forEach((key) => {
    matchs[matchId].players[key].ws.send(data);
  });
};

/**
 * This callback is called when a timer is done
 * @callback OnDone
 * @param {string} matchId
 * @param {'timerSurrender'|'timerTurn'} type
 * @returns {void}
 */

/**
 * Create a timer
 * @description
 *  - autoReset param false by default
 *  - time param is optional, if not provided, the timer will use the default time match defined
 * @param {{ matchId: string, type: 'timerSurrender'|'timerTurn'|'timerPreparation' , time?: number, timeReset: number, autoReset?: boolean }} config
 * @param {OnDone|undefined} onDone
 */
const timerMaker = ({ matchId, type, time, timeReset, autoReset }, onDone) => {
  matchs[matchId][type] = {
    time: time ?? matchs[matchId][type].time,
    stop: () => {
      clearInterval(matchs[matchId][type].interval);
      matchs[matchId][type].time = timeReset;
    },
    pause: () => clearInterval(matchs[matchId][type].interval),
    interval: setInterval(() => {
      matchs[matchId][type].time -= 1;
      sendToPlayers(matchId, action[type]({ timer: matchs[matchId][type].time }));

      if (matchs[matchId][type].time === 0) {
        matchs[matchId][type].time = timeReset;

        /**
         * @param {{ type: typeof type }} params
         */
        if (onDone) onDone({ type });
        else sendToPlayers(matchId, action[type]('Time is up!'));

        clearInterval(matchs[matchId][type].interval);

        if (autoReset ?? false)
          timerMaker({ matchId, type, time, timeReset, autoReset: autoReset ?? false }, onDone);
      }
    }, 1000),
  };
};

/**
 * Create a turn timer
 * @param {string} matchId
 * @returns {void}
 */
const timerTurn = (matchId) =>
  timerMaker({ matchId, type: 'timerTurn', timeReset: TIMER.turn, autoReset: true }, ({ type }) => {
    const [userKey, opponentKey] = Object.keys(matchs[matchId].players);
    matchs[matchId].totalTurn += 1;
    matchs[matchId].playerTurn = matchs[matchId].playerTurn === +userKey ? +opponentKey : +userKey;
    sendToPlayers(
      matchId,
      action[type]({
        totalTurn: matchs[matchId].totalTurn,
        message: 'Time is up!',
        playerTurn: matchs[matchId].playerTurn,
      })
    );
  });

// Create a match

/**
 * @param {WsUser} wsUser
 * @param {WsUser} wsOpponent
 * @returns {Promise<void>}
 */
const createMatch = async (wsUser, wsOpponent) => {
  try {
    // create match in mongodb
    /**
     * @type {typeof Match}
     */
    const match = await Match.create({
      playerTurn: wsUser.user.id,
      players: {
        [wsUser.user.id]: { ...wsUser.user, ...(await getHand(wsUser.user.deck)) },
        [wsOpponent.user.id]: { ...wsOpponent.user, ...(await getHand(wsOpponent.user.deck)) },
      },
    });

    // Save match in memory server
    matchs[match._id] = {
      ...match.toObject(),
      timerTurn: { time: TIMER.turn },
      timerPreparation: { time: TIMER.preparation },
      timerSurrender: {},
      players: {
        [wsUser.user.id]: {
          user: { ...wsUser.user, ...match.players.get(`${wsUser.user.id}`).toObject() },
          ws: wsUser.ws,
        },
        [wsOpponent.user.id]: {
          user: { ...wsOpponent.user, ...match.players.get(`${wsOpponent.user.id}`).toObject() },
          ws: wsOpponent.ws,
        },
      },
    };

    usersMatch[wsUser.user.id] = match._id;
    usersMatch[wsOpponent.user.id] = match._id;

    broadcast(match._id, {
      type: 'running',
      matchInfo: {
        playerTurn: match.playerTurn,
        totalTurn: match.totalTurn,
        battlefield: match.battlefield,
      },
    });

    timerMaker({ matchId: match._id, type: 'timerPreparation', timeReset: 0 }, () => {
      timerTurn(match._id);
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * @param {{
 *  matchHistoryPlayerRepository: MatchHistoryPlayerRepository,
 *  userRepository: UserRepository,
 *  player: { deck: string[], user: User, matchHistory: MatchHistory },
 *  status: 'winner'|'loser'|'abandon'
 * }} params
 * @returns {Promise<MatchHistoryPlayer>}
 */
const createMatchHistoryPlayer = async ({
  matchHistoryPlayerRepository,
  userRepository,
  player,
  status,
}) => {
  const matchHistoryPlayer = new MatchHistoryPlayer();
  matchHistoryPlayer.deck = player.deck;
  matchHistoryPlayer.status = status;
  matchHistoryPlayer.rankingPoints = GAIN.rankingPoints[status];
  matchHistoryPlayer.user = player.user;
  matchHistoryPlayer.matchHistory = player.matchHistory;

  await matchHistoryPlayerRepository.save(matchHistoryPlayer);

  await userRepository.updateQuantity(player.user.id, {
    rankingPoints: GAIN.rankingPoints[status],
    orundum: GAIN.orundum[status],
  });
};

/**
 * @param {Fastify} fastify
 * @param {{ matchId: string, winnerId: number, loserId: number, isDraw: boolean }} params
 * @returns {Promise<void>}
 */
const createMatchHistory = async (fastify, { matchId, winnerId, loserId, isDraw }) => {
  let players;
  /**
   * @type {Match}
   */
  const match = await Match.findById(matchId).exec();

  if (isDraw) {
    players = [...Array.from(match.players.values())];
  } else {
    players = [match.players.get(winnerId), match.players.get(loserId)];
  }

  /**
   * @type {{
   *  matchHistoryPlayerRepository: MatchHistoryPlayerRepository,
   *  matchHistoryRepository: MatchHistoryRepository,
   *  userRepository: UserRepository
   * }}
   */
  const { matchHistoryPlayerRepository, matchHistoryRepository, userRepository } = fastify.typeorm;

  const newMh = new MatchHistory();
  newMh.startedAt = match.startedAt;

  const matchHistory = await matchHistoryRepository.save(newMh);

  await Promise.all(
    players.map(async (p, k) => {
      const playerSatus = !(k % 2) ? 'winner' : 'loser';

      await createMatchHistoryPlayer({
        matchHistoryPlayerRepository,
        userRepository,
        player: {
          deck: p.deck,
          user: new User(p.id),
          matchHistory: new MatchHistory(matchHistory.id),
        },
        status: isDraw ? 'abandon' : playerSatus,
      });
    })
  );

  await Match.deleteOne({ _id: matchId }).exec();
};

// =============[Route]================ //

/**
 * @param {Fastify} fastify
 */
export default async (fastify) => {
  /**
   * @param {SocketStream} conn
   * @param {CustomRequest} req
   */
  fastify.get(
    '/',
    {
      websocket: true,
      onRequest: fastify.auth([fastify.tokenVerify]),
    },
    async (conn, req) => {
      const ws = conn.socket;
      const user = keysRemover(req.user, ['orundum', 'rankingPoints', 'password', 'operators']);

      // =============[On connection]================ //

      // Check if user is already in a match
      /**
       * @type {Match|undefined}
       */
      const matchFound = await Match.findOne({
        [`players.${user.id}`]: {
          $exists: true,
        },
      }).exec();

      // Assign the user to the found match in memory server
      if (matchFound) {
        if (matchs[matchFound._id]) {
          matchs[matchFound._id].players = Object.assign(matchs[matchFound._id].players, {
            [user.id]: {
              user: matchFound.players.get(`${user.id}`).toObject(),
              ws,
            },
          });
        }

        // Clear surrender timer
        if (matchs[matchFound._id].timerSurrender.interval) {
          matchs[matchFound._id].timerSurrender.stop();
        }

        broadcast(matchFound._id, {
          type: 'running',
          matchInfo: {
            numberTurn: matchFound.numberTurn,
            battlefield: matchFound.battlefield,
          },
        });

        // Start preparation timer
        if (matchs[matchFound._id].timerPreparation.time > 0) {
          timerMaker({ matchId: matchFound._id, type: 'timerPreparation', timeReset: 0 }, () => {
            timerTurn(matchFound._id);
          });
        } else {
          timerTurn(matchFound._id);
        }
      } else if (waitingRooms.length > 0) {
        // If a player found an opponent, create a match
        const wsOpponent = waitingRooms.pop();
        await createMatch({ user, ws }, wsOpponent);
      } else {
        // If no opponent found, add the player to the waiting room
        waitingRooms.push({ user, ws });
        ws.send(action.waiting('Waiting for an opponent...'));
      }

      // =============[On action message]================ //

      conn.socket.on('message', () => {});

      // =============[On close]================ //

      conn.socket.on('close', async () => {
        /**
         * @type {string|undefined}
         */
        const matchId = usersMatch[user.id];
        if (matchId) {
          if (matchs[matchId]) {
            // Pause turn timer
            if (matchs[matchId].timerTurn.interval) {
              matchs[matchId].timerTurn.pause();
            }

            // Delete player from match
            delete matchs[matchId].players[user.id];

            if (Object.entries(matchs[matchId].players) < 1) {
              // Stop surrender timer
              matchs[matchId].timerSurrender.stop();

              // Remove matchId reference from usersMatch
              usersMatch = Object.fromEntries(
                Object.entries(usersMatch).filter(([key, value]) => value !== matchId)
              );

              await createMatchHistory(fastify, { matchId, isDraw: true });
              delete matchs[matchId];
            } else {
              // When a player left, send a message to his opponent and start a surrender timer
              const [opponentKey] = Object.keys(matchs[matchId].players);

              matchs[matchId].players[opponentKey].ws.send(
                action.opponentLeft('Your opponent has left, wait for his comeback')
              );

              if (matchs[matchId].timerPreparation.interval) {
                matchs[matchId].timerPreparation.pause();
              }

              // Start surrender timer
              // If the player doesn't come back, he will lose the match
              timerMaker(
                {
                  matchId,
                  type: 'timerSurrender',
                  time: TIMER.surrender,
                  timeReset: TIMER.surrender,
                },
                async () => {
                  usersMatch = Object.fromEntries(
                    Object.entries(usersMatch).filter(([key, value]) => value !== matchId)
                  );

                  await createMatchHistory(fastify, {
                    matchId,
                    winnerId: opponentKey,
                    loserId: `${user.id}`,
                  });

                  matchs[matchId].players[opponentKey].ws.send(
                    action.victory('Your opponent has left, you win!')
                  );

                  delete matchs[matchId];
                }
              );
            }
          }
        } else if (
          waitingRooms.length > 0 &&
          waitingRooms.find((player) => player.user.id === user.id)
        ) {
          waitingRooms = waitingRooms.filter((player) => player.user.id !== user.id);
        }
      });
    }
  );
};
