import { Match, MatchStatusEnum } from '../../mongoose/models/Match.js';
/**
 * @param {Fastify} fastify
 */
export default async (fastify) => {
  let waitingRooms = [];
  const matchs = {};

  const createMatch = async (wsUser, wsOpponent) => {
    try {
      // create match in mongodb
      const match = await Match.create({
        startedAt: new Date(),
        status: MatchStatusEnum.WAITING,
        numberTurn: 0,
        nextTurn: wsUser.user.id,
        $set: {
          [`players.${wsUser.user.id}`]: wsUser.user,
          [`players.${wsOpponent.user.id}`]: wsOpponent.user,
        },
      });

      // add match to matchs in memory of the server
      matchs[match._id] = Object.assign(match, {
        players: {
          [wsUser.user.id]: wsUser,
          [wsOpponent.user.id]: wsOpponent,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const broadcast = (matchId, data) => {
    const match = matchs[matchId];

    Object.keys(match).forEach((key) => {
      match[key].ws.send(JSON.stringify(data));
    });
  };

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
      const { orundum, ...user } = req;
      const wsUser = { user, ws };

      // ==================================== //

      // check if user is already in a match
      const matchFound = await Match.findOne({
        [`players.${wsUser.user.id}`]: {
          $exists: true,
        },
      }).exec();

      // assign the user to the found match
      if (matchFound) {
        if (matchs[matchFound._id]) {
          matchs[matchFound._id].players = Object.assign(matchs[matchFound._id].players, {
            [wsUser.user.id]: wsUser,
          });

          const { [wsUser.user.id]: me, ...opponent } = matchs[matchFound._id].players;

          broadcast(matchFound._id, {
            type: 'join',
            matchInfo: {
              battlefield: matchFound.battlefield,
              me: me.user,
              opponent: {
                username: opponent.user.username,
                picture: opponent.user.picture,
                hand: opponent.user.hand.length,
              },
            },
          });
        }
      } else if (waitingRooms.length > 0) {
        const wsOpponent = waitingRooms.pop();
        await createMatch(wsUser, wsOpponent);
      } else {
        waitingRooms.push(wsUser);
      }

      // ==================================== //

      conn.socket.on('close', () => {
        waitingRooms = waitingRooms.filter((name) => name !== user.username);
      });
    }
  );
};

// /**
//  * @param {Fastify} fastify
//  */
// export default async (fastify) => {
//   const maxPlayers = 2;
//   let waitingRooms = [];
//   let matchs = {};

//   /**
//    * @param {SocketStream} conn
//    * @param {RequestFastify} req
//    */
//   fastify.get('/', { websocket: true }, (conn, req) => {
//     const ws = conn.socket;

//     if (waitingRooms.includes(req.query.name)) {
//       ws.send('You are already in a waiting room!');
//     } else {
//       ws.send(`Welcome ${req.query.name} in the waiting room!`);
//       waitingRooms.push(req.query.name);
//       ws.send(`${waitingRooms.length} Players waiting!`);
//     }

//     const create = () => {
//       const matchId = genKey();
//       ws.match = matchId;
//       matchs[matchId] = [ws];
//     };

//     const join = (params) => {
//       const { matchId } = params;

//       if (!Object.keys(matchs).includes(matchId)) {
//         ws.send(`Match ${matchId} does not exist!`);
//         return;
//       }

//       if (matchs[matchId].length >= maxPlayers) {
//         ws.send(`Match ${matchId} is full!`);
//         return;
//       }

//       ws.match = matchId;
//       matchs[matchId].push(ws);
//     };

//     const leave = () => {
//       const { match } = ws;
//       matchs[match] = matchs[match].filter((so) => so !== ws);
//       ws.match = undefined;

//       if (matchs[match].length === 0) {
//         matchs = matchs.filter((key) => key !== match);
//       }
//     };

//     conn.socket.on('close', () => {
//       waitingRooms = waitingRooms.filter((name) => name !== req.query.name);
//     });

//     conn.socket.on('message', (data) => {
//       const { type, params } = JSON.parse(data);

//       switch (type) {
//         case 'create':
//           create(params);
//           break;
//         case 'join':
//           join(params);
//           break;
//         case 'leave':
//           leave();
//           break;
//         default:
//           break;
//       }
//     });
//   });
// };
