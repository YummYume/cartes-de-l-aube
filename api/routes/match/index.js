import { keysRemover } from '../../lib/utils.js';
import { Match } from '../../mongoose/models/Match.js';

let waitingRooms = [];
const matchs = {};

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
    match.players[key].ws.send(JSON.stringify(data));
  });
};

const timerTurn = (matchId) => {
  const match = matchs[matchId];

  matchs[matchId].timerTurn = {
    ...matchs[matchId].timerTurn,
    interval: setInterval(() => {
      matchs[matchId].timerTurn.time -= 1;
      sendToPlayers(match, {
        type: 'timer',
        timer: matchs[matchId].timerTurn.time,
      });
      if (matchs[matchId].timerTurn.time === 0) {
        matchs[matchId].timerTurn.time = 31;
        sendToPlayers(match, {
          type: 'timer',
          timer: 'done',
        });
        clearInterval(matchs[matchId].timerTurn.interval);
        timerTurn(matchId);
      }
    }, 1000),
  };
};

const timerSurrender = (matchId) => {
  const match = matchs[matchId];

  matchs[matchId].timerSurrender = {
    time: 1.5 * 60,
    interval: setInterval(() => {
      matchs[matchId].timerSurrender.time -= 1;
      sendToPlayers(match, {
        type: 'timer-surrender',
        timer: matchs[matchId].timerSurrender.time,
      });
      if (matchs[matchId].timerSurrender.time === 0) {
        matchs[matchId].timerSurrender.time = 1.5 * 60;
        sendToPlayers(match, {
          type: 'timer-surrender',
          timer: 'done',
        });
        clearInterval(matchs[matchId].timerSurrender.interval);
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

    // save match in memory server
    matchs[match._id] = {
      ...match.toObject(),
      timerTurn: { time: 31 },
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

    broadcast(match._id, {
      type: 'running',
      matchInfo: {
        playerTurn: match.playerTurn,
        totalTurn: match.totalTurn,
        battlefield: match.battlefield,
      },
    });

    timerTurn(match._id);

    return match._id;
  } catch (err) {
    console.log(err);
    return null;
  }
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

      // check if user is already in a match
      const matchFound = await Match.findOne({
        [`players.${user.id}`]: {
          $exists: true,
        },
      }).exec();

      // assign the user to the found match
      if (matchFound) {
        if (matchs[matchFound._id]) {
          ws.match = matchFound._id;
          matchs[matchFound._id].players = Object.assign(matchs[matchFound._id].players, {
            [user.id]: {
              user: matchFound.players.get(`${user.id}`).toObject(),
              ws,
            },
          });
        }

        broadcast(matchFound._id, {
          type: 'running',
          matchInfo: {
            numberTurn: matchFound.numberTurn,
            battlefield: matchFound.battlefield,
          },
        });
      } else if (waitingRooms.length > 0) {
        const wsOpponent = waitingRooms.pop();
        ws.match = await createMatch({ user, ws }, wsOpponent);
      } else {
        waitingRooms.push({ user, ws, match: null });
        ws.send('Waiting for an opponent...');
      }

      // =============[On action message]================ //

      conn.socket.on('message', (data) => {
        const { type, params } = JSON.parse(data);

        switch (type) {
          case 'action':
            break;
          default:
        }
      });

      // =============[On close]================ //

      conn.socket.on('close', () => {
        if (ws.match) {
          if (matchs[ws.match]) {
            clearInterval(matchs[ws.match].timerTurn.interval);

            if (matchs[ws.match].players < 2) {
              delete matchs[ws.match];
              Match.deleteOne({ _id: ws.match });
            } else {
              delete matchs[ws.match].players[user.id];
              const [opponentKey] = Object.keys(matchs[ws.match].players);

              matchs[ws.match].players[opponentKey].ws.send(
                JSON.stringify({
                  type: 'opponent-disconnected',
                  info: 'Your opponent has disconnected, wait for his reconnection or his surrender!',
                })
              );
              timerSurrender(ws.match);
            }
          }
        } else {
          waitingRooms = waitingRooms.filter((player) => player.user.id !== user.id);
          conn.socket.send(waitingRooms.length, ' Players waiting!');
        }
      });
    }
  );
};
