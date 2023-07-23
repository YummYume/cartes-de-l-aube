import { keysRemover } from '../../lib/utils.js';
import { Match } from '../../mongoose/models/Match.js';
import { MatchHistory } from '../../typeorm/models/MatchHistory.js';
import { MatchHistoryPlayer } from '../../typeorm/models/MatchHistoryPlayer.js';
import { User } from '../../typeorm/models/User.js';

let waitingRooms = [];
let usersMatch = {};
const matchs = {};

const ACTION_TYPE = {
  running: 'running',
  victory: 'victory',
  surrender: 'surrender',
  timerTurn: 'timer-turn',
  timerSurrender: 'timer-surrender',
  opponentLeft: 'opponent-left',
  error: 'error',
  waiting: 'waiting',
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
const action = {
  running: (data) => actionMaker(ACTION_TYPE.running, data),
  victory: (data) => actionMaker(ACTION_TYPE.victory, data),
  surrender: (data) => actionMaker(ACTION_TYPE.surrender, data),
  timerTurn: (data) => actionMaker(ACTION_TYPE.timerTurn, data),
  timerSurrender: (data) => actionMaker(ACTION_TYPE.timerSurrender, data),
  opponentLeft: (data) => actionMaker(ACTION_TYPE.opponentLeft, data),
  error: (data) => actionMaker(ACTION_TYPE.error, data),
  waiting: (data) => actionMaker(ACTION_TYPE.waiting, data),
};

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

const sendToPlayers = (match, data) => {
  Object.keys(match.players).forEach((key) => {
    match.players[key].ws.send(data);
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
 * @description
 *  - autoReset param false by default
 *  - time param is optional, if not provided, the timer will use the default time match defined
 * @param {{ matchId: string, type: 'timerSurrender'|'timerTurn' , time?: number, timeReset: number, autoReset?: boolean }} config
 * @param {OnDone|undefined} onDone
 */
const timerMaker = ({ matchId, type, time, timeReset, autoReset }, onDone) => {
  matchs[matchId][type] = {
    time: time ?? matchs[matchId][type].time,
    clear: () => {
      clearInterval(matchs[matchId][type].interval);
      matchs[matchId][type].time = timeReset;
    },
    pause: () => clearInterval(matchs[matchId][type].interval),
    interval: setInterval(() => {
      matchs[matchId][type].time -= 1;
      sendToPlayers(matchs[matchId], action[type]({ timer: matchs[matchId][type].time }));

      if (matchs[matchId][type].time === 0) {
        matchs[matchId][type].time = timeReset;

        if (onDone) onDone({ matchId, type });
        else sendToPlayers(matchs[matchId], action[type]('Time is up!'));

        clearInterval(matchs[matchId][type].interval);

        if (autoReset ?? false)
          timerMaker({ matchId, type, time, timeReset, autoReset: autoReset ?? false }, onDone);
      }
    }, 1000),
  };
};

// Create a match
const createMatch = async (wsUser, wsOpponent) => {
  try {
    // create match in mongodb
    /**
     * @type {typeof Match}
     */
    const match = await Match.create({
      playerTurn: wsUser.user.id,
      players: {
        [wsUser.user.id]: wsUser.user,
        [wsOpponent.user.id]: wsOpponent.user,
      },
    });

    // Save match in memory server
    matchs[match._id] = {
      ...match.toObject(),
      timerTurn: { time: 0.5 * 60 + 1 },
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

    timerMaker(
      { matchId: match._id, type: 'timerTurn', timeReset: 0.5 * 60 + 1, autoReset: true },
      ({ type }) => {
        matchs[match._id].totalTurn += 1;
        matchs[match._id].playerTurn =
          matchs[match._id].playerTurn === wsUser.user.id ? wsOpponent.user.id : wsUser.user.id;
        sendToPlayers(
          matchs[match._id],
          action[type]({
            totalTurn: matchs[match._id].totalTurn,
            message: 'Time is up!',
            playerTurn: matchs[match._id].playerTurn,
          })
        );
      }
    );
  } catch (err) {
    console.log(err);
  }
};

/**
 * @param {MatchHistoryPlayerRepository} matchHistoryPlayerRepository
 * @param {{ player: { deck: string[], rankingPoints: number, user: User }, status: 'winner'|'loser'|'abandon' }} params
 * @returns {Promise<MatchHistoryPlayer>}
 */
const createMatchHistoryPlayer = async (matchHistoryPlayerRepository, { player, status }) => {
  const rankingPoints = {
    winner: player.rankingPoints + 20,
    loser: player.rankingPoints - 20,
    abandon: player.rankingPoints,
  }[status];

  const matchHistoryPlayer = new MatchHistoryPlayer();
  matchHistoryPlayer.deck = player.deck;
  matchHistoryPlayer.status = status;
  matchHistoryPlayer.rankingPoints = rankingPoints;
  matchHistoryPlayer.user = player.user;

  return matchHistoryPlayerRepository.save(matchHistoryPlayer);
};

/**
 * @param {Fastify} fastify
 * @param {{ matchId: string, winnerId: number, loserId: number, isDraw: boolean }} params
 * @returns {Promise<void>}
 */
const saveMatchHistory = async (fastify, { matchId, winnerId, loserId, isDraw }) => {
  const match = await Match.findById(matchId).exec();

  const winner = match.players.get(winnerId);
  const loser = match.players.get(loserId);

  /**
   * @type {{ matchHistoryPlayerRepository: MatchHistoryPlayerRepository, matchHistoryRepository: MatchHistoryRepository }}
   */
  const { matchHistoryPlayerRepository, matchHistoryRepository } = fastify.typeorm;

  const winnerMph = await createMatchHistoryPlayer(matchHistoryPlayerRepository, {
    player: {
      deck: winner.deck,
      rankingPoints: winner.rankingPoints,
      user: new User(winnerId),
    },
    status: isDraw ? 'abandon' : 'winner',
  });

  const loserMph = await createMatchHistoryPlayer(matchHistoryPlayerRepository, {
    player: {
      deck: loser.deck,
      rankingPoints: loser.rankingPoints,
      user: new User(loserId),
    },
    status: isDraw ? 'abandon' : 'loser',
  });

  const matchHistory = new MatchHistory();
  // matchHistory.startedAt = match.startedAt;
  matchHistory.players = [winnerMph, loserMph];

  await matchHistoryRepository.save(matchHistory);
  await Match.deleteOne({ _id: matchId }).exec();
};

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
      const user = keysRemover(req.user, ['orundum', 'password', 'operators']);

      // =============[On connection]================ //

      // Check if user is already in a match
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
          matchs[matchFound._id].timerSurrender.clear();
        }

        broadcast(matchFound._id, {
          type: 'running',
          matchInfo: {
            numberTurn: matchFound.numberTurn,
            battlefield: matchFound.battlefield,
          },
        });

        // Start turn timer at previous time
        timerMaker(
          { matchId: matchFound._id, type: 'timerTurn', timeReset: 0.5 * 60 + 1, autoReset: true },
          ({ type }) => {
            const [userKey, opponentKey] = Object.keys(matchs[matchFound._id].players);
            matchs[matchFound._id].totalTurn += 1;
            matchs[matchFound._id].playerTurn =
              matchs[matchFound._id].playerTurn === +userKey ? +opponentKey : +userKey;
            sendToPlayers(
              matchs[matchFound._id],
              action[type]({
                totalTurn: matchFound.totalTurn,
                message: 'Time is up!',
                playerTurn: matchs[matchFound._id].playerTurn,
              })
            );
          }
        );
      } else if (waitingRooms.length > 0) {
        const wsOpponent = waitingRooms.pop();
        await createMatch({ user, ws }, wsOpponent);
      } else {
        waitingRooms.push({ user, ws });
        ws.send(action.waiting('Waiting for an opponent...'));
      }

      // =============[On action message]================ //

      conn.socket.on('message', () => {});

      // =============[On close]================ //

      conn.socket.on('close', async () => {
        const matchId = usersMatch[user.id];
        if (matchId) {
          if (matchs[matchId]) {
            // Pause turn timer
            matchs[matchId].timerTurn.pause();
            // Delete player from match
            delete matchs[matchId].players[user.id];

            if (Object.entries(matchs[matchId].players) < 1) {
              // Stop surrender timer
              matchs[matchId].timerSurrender.clear();

              // Remove matchId reference from usersMatch
              usersMatch = Object.fromEntries(
                Object.entries(usersMatch).filter(([key, value]) => value !== matchId)
              );

              // Delete match from memory server
              delete matchs[matchId];
              await Match.deleteOne({ _id: matchId });
            } else {
              // When a player left, send a message to his opponent and start a surrender timer
              const [opponentKey] = Object.keys(matchs[matchId].players);

              matchs[matchId].players[opponentKey].ws.send(
                action.opponentLeft('Your opponent has left, wait for his comeback')
              );

              // 1.5 * 60 + 1
              timerMaker({ matchId, type: 'timerSurrender', time: 2, timeReset: 2 }, async () => {
                await saveMatchHistory(fastify, {
                  matchId,
                  winnerId: opponentKey,
                  loserId: `${user.id}`,
                });
                matchs[matchId].players[opponentKey].ws.send(
                  action.victory('Your opponent has left, you win!')
                );
                delete matchs[matchId];
              });
            }
          }
        } else {
          // Remove player from waiting room
          waitingRooms = waitingRooms.filter((player) => player.user.id !== user.id);
          conn.socket.send(waitingRooms.length, ' Players waiting!');
        }
      });
    }
  );
};
