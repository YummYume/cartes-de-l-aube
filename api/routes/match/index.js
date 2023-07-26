import { keysRemover, objInArr } from '../../lib/utils.js';
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
 *    battlefield: {
 *     [key: string]: { operator: Operator, position: number }[]
 *    },
 *    timerTurn: { time: number, stop: () => void, pause: () => void, interval: NodeJS.Timeout },
 *    timerSurrender: { time: number, stop: () => void, pause: () => void, interval: NodeJS.Timeout },
 *    timerPreparation: { time: number, stop: () => void, pause: () => void, interval: NodeJS.Timeout },
 *    players: {
 *      [key: string]: {
 *        user: {
 *          id: number,
 *          hp: number,
 *          username: string,
 *          image: string,
 *          energy: number,
 *          deck: string[],
 *          gameDeck: Operator[],
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
  preparation: 10 + 1,
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
  info: 'info',
  waiting: 'waiting',
};

// =============[Utils]================ //

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
 * @param {number} time
 * @returns {void}
 */

/**
 * This callback is called each second
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
 * @param {{
 *  matchId: string,
 *  type: 'timerSurrender'|'timerTurn'|'timerPreparation',
 *  time?: number,
 *  timeReset: number,
 *  autoReset?: boolean,
 *  onDone?: OnDone
 *  onEach?: OnEach
 * }} config
 */
const timerMaker = ({ matchId, type, time, timeReset, autoReset, onEach, onDone }) => {
  matchs[matchId][type] = {
    time: time ?? matchs[matchId][type].time,
    stop: () => {
      clearInterval(matchs[matchId][type].interval);
      matchs[matchId][type].time = timeReset;
    },
    pause: () => clearInterval(matchs[matchId][type].interval),
    interval: setInterval(() => {
      matchs[matchId][type].time -= 1;

      if (onEach) onEach({ matchId, type, time: matchs[matchId][type].time });
      else sendToPlayers(matchId, action[type]({ time: matchs[matchId][type].time }));

      if (matchs[matchId][type].time === 0) {
        matchs[matchId][type].time = timeReset;

        /**
         * @param {{ type: typeof type }} params
         */
        if (onDone) onDone({ matchId, type });
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
  timerMaker({
    matchId,
    type: 'timerTurn',
    timeReset: TIMER.turn,
    autoReset: true,
    onDone: ({ type }) => {
      const [userKey, opponentKey] = Object.keys(matchs[matchId].players);
      matchs[matchId].totalTurn += 1;
      matchs[matchId].playerTurn =
        matchs[matchId].playerTurn === +userKey ? +opponentKey : +userKey;
      sendToPlayers(
        matchId,
        action[type]({
          totalTurn: matchs[matchId].totalTurn,
          message: 'Time is up!',
          playerTurn: matchs[matchId].playerTurn,
        })
      );
    },
  });

/**
 * Create a preration timer
 * @param {string} matchId
 * @returns {void}
 */
const timerPreparation = (matchId) =>
  timerMaker({
    matchId,
    type: 'timerPreparation',
    timeReset: TIMER.preparation,
    onDone: async () => {
      const match = await Match.findById(matchId)
      .populate('battlefield.$*.operator')
      .populate('players.$*.gameDeck')
      .exec();

      Object.keys(match.players).forEach((key) => {
        const opponentKey = Object.keys(match.players).find((k) => k !== key);
        match.players[key].ws.send(
          JSON.stringify({
            ...data,
            user: match.players[key].user,
          })
        );
      });
      sendToPlayers(matchId, action.timerPreparation({ message: 'Preparation phase is over', data: }))
      timerTurn(matchId);
    },
  });

// Create a match
/**
 * @param {WsUser} wsUser
 * @param {WsUser} wsOpponent
 * @returns {Promise<void>}
 */
const createMatch = async (wsUser, wsOpponent) => {
  try {
    const userDeck = await Operator.find({ name: { $in: wsUser.user.deck } }, { _id: 1 });
    const opponentDeck = await Operator.find({ name: { $in: wsOpponent.user.deck } }, { _id: 1 });
    /**
     * @type {Match}
     */
    await Match.create({
      playerTurn: wsUser.user.id,
      battlefield: {
        [wsUser.user.id]: [],
        [wsOpponent.user.id]: [],
      },
      players: {
        [wsUser.user.id]: { ...wsUser.user, gameDeck: userDeck },
        [wsOpponent.user.id]: { ...wsOpponent.user, gameDeck: opponentDeck },
      },
    });

    const match = await Match.findOne({ [`players.${wsUser.user.id}`]: { $exists: true } })
    .populate('battlefield.$*.operator')
    .populate('players.$*.gameDeck')
    .exec();

    // Save match in memory server
    matchs[match._id] = {
      ...match.toObject(),
      timerTurn: { time: TIMER.turn },
      timerPreparation: { time: TIMER.preparation },
      timerSurrender: {},
      battlefield: {
        [wsUser.user.id]: match.battlefield.get(`${wsUser.user.id}`).toObject(),
        [wsOpponent.user.id]: match.battlefield.get(`${wsOpponent.user.id}`).toObject(),
      },
      players: {
        [wsUser.user.id]: {
          user: match.players.get(`${wsUser.user.id}`).toObject(),
          ws: wsUser.ws,
        },
        [wsOpponent.user.id]: {
          user: match.players.get(`${wsUser.user.id}`).toObject(),
          ws: wsOpponent.ws,
        },
      },
    };

    usersMatch[wsUser.user.id] = match._id;
    usersMatch[wsOpponent.user.id] = match._id;

    broadcast(match._id, {
      type: ACTION_TYPE.running,
      matchInfo: {
        playerTurn: match.playerTurn,
        totalTurn: match.totalTurn,
        battlefield: match.battlefield,
      },
    });

    if (matchs[match._id].timerPreparation.time > 0) {
      timerPreparation(match._id);
    } else {
      timerTurn(match._id);
    }
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
          type: ACTION_TYPE.running,
          matchInfo: {
            playerTurn: matchs[matchFound._id].playerTurn,
            numberTurn: matchs[matchFound._id].numberTurn,
            battlefield: matchs[matchFound._id].battlefield,
          },
        });

        // Start preparation timer
        if (matchs[matchFound._id].timerPreparation.time > 0) {
          timerPreparation(matchFound._id);
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

      conn.socket.on('message', async (message) => {
        const { type, ...data } = JSON.parse(message);
        const match = matchs[usersMatch[user.id]];

        if (type && data && match) {
          switch (type) {
            case 'preparation-phase':
              // Check if the preparation phase is over
              if (match.timerPreparation.time > 0 && data.cards) {
                data.cards.forEach((card) => {
                  // Check if the card is already on the battlefield
                  if (!objInArr(match.battlefield[user.id], card, '_id')) {
                    // Check if the card position is valid
                    if (
                      card.position >= 0 &&
                      card.position <= 3 &&
                      !objInArr(match.battlefield[user.id], card, 'position')
                    ) {
                      // Remove card from user game deck
                      match.players[user.id].user.gameDeck = match.players[
                        user.id
                      ].user.gameDeck.filter((c) => c.position !== card.position);

                      // Add card to battlefield
                      match.battlefield[user.id].push(card);
                    } else {
                      ws.send(action.error('Position already taken'));
                    }
                  } else {
                    ws.send(action.error("You can't put the same card twice"));
                  }
                });

                // Save changes in memory server
                matchs[usersMatch[user.id]].players[user.id].gameDeck = match.players[user.id].user.gameDeck;
                matchs[usersMatch[user.id]].battlefield[user.id] = match.battlefield[user.id];

                const cost = await Operator.aggregate([
                  {
                    $match: {
                      _id: { $in: match.battlefield[user.id] },
                    },
                    $group: {
                      _id: null,
                      totalCost: { $sum: '$statistics.cost' },
                    },
                  },
                ]);
                // Send changes in database
                await Match.updateOne(
                  { _id: match._id },
                  {
                    $set: {
                      battlefield: {
                        $set: {
                          [user.id]: match.battlefield[user.id],
                        },
                      },
                      players: {
                        $set: {
                          [`${user.id}.gameDeck`]: match.players[user.id].user.gameDeck,
                        },
                      },
                    },
                  }
                );
              } else {
                ws.send(action.error('Preparation phase is over'));
              }
              break;
            default:
              console.log('bob');
              break;
          }
        }
      });

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
              timerMaker({
                matchId,
                type: 'timerSurrender',
                time: TIMER.surrender,
                timeReset: TIMER.surrender,
                onDone: async () => {
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
                },
              });
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
