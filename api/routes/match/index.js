import { mongo } from 'mongoose';

import { keysRemover, objInArr, wait } from '../../lib/utils.js';
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
  preparation: 15 + 1,
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
  preparationPhase: 'preparation-phase',
  turnPhase: 'turn-phase',
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

/**
 * @param {[]} arr
 * @param {string} cardId
 * @returns {[]}
 */
const removeCard = (arr, cardId) => {
  const cards = [...arr];
  const indexToRemove = cards.findIndex((obj) => obj.operator._id.toString() === cardId);

  if (indexToRemove !== -1) {
    cards.splice(indexToRemove, 1);
    for (let i = cards.length - 1; i >= 0; i -= 1) {
      cards[i].position = i + 1;
    }
  }

  return cards;
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
 *  timeBetweenReset?: number,
 *  onDone?: OnDone
 *  onEach?: OnEach
 * }} config
 */
const timerMaker = ({
  matchId,
  type,
  time,
  timeReset,
  autoReset,
  timeBetweenReset,
  onEach,
  onDone,
}) => {
  matchs[matchId][type] = {
    time: time ?? matchs[matchId][type].time,
    stop: () => {
      clearInterval(matchs[matchId][type].interval);
      matchs[matchId][type].time = timeReset;
    },
    pause: () => clearInterval(matchs[matchId][type].interval),
    interval: setInterval(async () => {
      matchs[matchId][type].time -= 1;

      if (onEach) onEach({ matchId, type, time: matchs[matchId][type].time });
      else sendToPlayers(matchId, action[type]({ time: matchs[matchId][type].time }));

      if (matchs[matchId][type].time <= 0) {
        /**
         * @param {{ type: typeof type }} params
         */
        if (onDone) onDone({ matchId, type });
        else sendToPlayers(matchId, action[type]('Time is up!'));

        clearInterval(matchs[matchId][type].interval);

        if (timeBetweenReset) {
          await wait(timeBetweenReset);
        }

        matchs[matchId][type].time = timeReset;

        if (autoReset ?? false) {
          timerMaker({
            matchId,
            type,
            time,
            timeReset,
            timeBetweenReset,
            autoReset: autoReset ?? false,
            onDone,
          });
        }
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
    timeBetweenReset: 10 * 1000,
    onDone: async () => {
      const match = await Match.findById(matchId)
        .populate('battlefield.$*.operator')
        .populate('players.$*.gameDeck')
        .exec();

      const [player1, player2] = Array.from(match.players.values());

      matchs[match._id] = {
        ...matchs[match._id],
        ...match.toObject(),
        totalTurn: match.totalTurn + 1,
        playerTurn:
          match.playerTurn === player1.toObject().id
            ? player2.toObject().id
            : player1.toObject().id,
        players: [player1, player2].reduce((acc, curr) => {
          return { ...acc, [curr.id]: { ...acc[curr.id], user: curr.toObject() } };
        }, matchs[match._id].players),
      };

      match.totalTurn = matchs[match._id].totalTurn;
      match.playerTurn = matchs[match._id].playerTurn;

      await match.save();

      Object.keys(matchs[matchId].players).forEach((key) => {
        matchs[matchId].players[key].ws.send(
          action.turnPhase({
            totalTurn: matchs[match._id].totalTurn,
            playerTurn: matchs[match._id].playerTurn,
            actionTurn: match.actionTurn,
            user: matchs[matchId].players[key].user,
            battlefield: match.battlefield,
          })
        );
      });
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
    timeReset: 0,
    onDone: async () => {
      const match = await Match.findById(matchId)
        .populate('battlefield.$*.operator')
        .populate('players.$*.gameDeck')
        .exec();

      const [player1, player2] = Array.from(match.players.values());

      matchs[match._id] = {
        ...matchs[match._id],
        ...match.toObject(),
        totalTurn: match.totalTurn + 1,
        playerTurn:
          match.playerTurn === player1.toObject().id
            ? player2.toObject().id
            : player1.toObject().id,
        players: [player1, player2].reduce((acc, curr) => {
          return { ...acc, [curr.id]: { ...acc[curr.id], user: curr.toObject() } };
        }, matchs[match._id].players),
      };

      match.totalTurn = matchs[match._id].totalTurn;
      match.playerTurn = matchs[match._id].playerTurn;

      await match.save();

      Object.keys(matchs[matchId].players).forEach((key) => {
        matchs[matchId].players[key].ws.send(
          action.turnPhase({
            totalTurn: matchs[match._id].totalTurn,
            playerTurn: matchs[match._id].playerTurn,
            actionTurn: match.actionTurn,
            user: matchs[matchId].players[key].user,
            battlefield: match.battlefield,
          })
        );
      });

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
          user: match.players.get(`${wsOpponent.user.id}`).toObject(),
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
      const user = keysRemover(req.user, [
        'orundum',
        'rankingPoints',
        'password',
        'operators',
        'role',
      ]);

      // =============[On connection]================ //

      // Check if user is already in a match
      /**
       * @type {Match|undefined}
       */
      const match = await Match.findOne({
        [`players.${user.id}`]: {
          $exists: true,
        },
      })
        .populate('battlefield.$*.operator')
        .populate('players.$*.gameDeck')
        .exec();

      // Assign the user to the found match in memory server
      if (match) {
        if (matchs[match._id]) {
          matchs[match._id].players[user.id] = {
            user: match.players.get(`${user.id}`).toObject(),
            ws,
          };
        }

        // Clear surrender timer
        if (matchs[match._id].timerSurrender.interval) {
          matchs[match._id].timerSurrender.stop();
        }

        // Start preparation timer
        if (matchs[match._id].timerPreparation.time > 0) {
          timerPreparation(match._id);
        } else {
          timerTurn(match._id);
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
        let updateMatch;
        const { type, ...data } = JSON.parse(message);
        const matchStateMemory = matchs[usersMatch[user.id]];
        // let match = matchs[usersMatch[user.id]];
        // const opponent = Object.keys(match.players).find((k) => k !== `${user.id}`);

        if (type && data && matchStateMemory) {
          switch (type) {
            case 'preparation-phase':
              // Check if the preparation phase is over
              if (matchStateMemory.timerPreparation.time > 0 && data.cards) {
                updateMatch = await Match.findOne({ _id: usersMatch[user.id] })
                  .populate('battlefield.$*.operator')
                  .populate('players.$*.gameDeck')
                  .exec();
                /**
                 * @type {{ cards: { _id: string, position: number }[] }}
                 */
                const { cards } = data;
                cards.forEach((card) => {
                  if (!objInArr(updateMatch.battlefield.get(`${user.id}`), card, '_id')) {
                    // Check if the card position is valid
                    if (
                      card.position >= 0 &&
                      card.position <= 3 &&
                      !objInArr(updateMatch.battlefield.get(`${user.id}`), card, 'position')
                    ) {
                      // Add card to battlefield
                      updateMatch.battlefield.set(`${user.id}`, [
                        ...updateMatch.battlefield.get(`${user.id}`),
                        {
                          operator: new mongo.ObjectId(card._id),
                          position: card.position,
                          statistics: updateMatch.players
                            .get(`${user.id}`)
                            .gameDeck.find((c) => c._id.toString() === card._id).statistics,
                        },
                      ]);

                      // Remove card from user game deck
                      updateMatch.players.set(`${user.id}`, {
                        ...updateMatch.players.get(`${user.id}`).toObject(),
                        gameDeck: updateMatch.players
                          .get(`${user.id}`)
                          .gameDeck.reduce((acc, curr) => {
                            if (curr._id.toString() !== card._id) {
                              acc.push(new mongo.ObjectId(curr._id));
                            }

                            return acc;
                          }, []),
                      });
                    } else {
                      ws.send(action.error('Position already taken'));
                    }
                  } else {
                    ws.send(action.error("You can't put the same card twice"));
                  }
                });

                const energyLeft =
                  updateMatch.players.get(`${user.id}`).energy -
                  updateMatch.battlefield
                    .get(`${user.id}`)
                    .reduce((acc, curr) => acc + curr.statistics.cost, 0);

                if (energyLeft >= 0) {
                  updateMatch.players.set(`${user.id}`, {
                    ...updateMatch.players.get(`${user.id}`).toObject(),
                    energy: energyLeft,
                  });

                  await updateMatch.save();

                  ws.send(action.info({ updateMatch }));
                } else {
                  ws.send(action.error('Cheater: Not enough energy'));
                }
              } else {
                ws.send(action.error('Preparation phase is over'));
              }
              break;
            case 'action':
              if (
                matchStateMemory.timerPreparation.time === 0 &&
                matchStateMemory.playerTurn === user.id &&
                matchStateMemory.timerTurn.time > 0 &&
                matchStateMemory.timerTurn.time <= 30 &&
                data.actions
              ) {
                updateMatch = await Match.findOne({ _id: usersMatch[user.id] })
                  .populate('battlefield.$*.operator')
                  .populate('players.$*.gameDeck')
                  .exec();
                /**
                 * @type {{ actions: { deploys: { _id: string, position: number }[], attacks: { initiator: string, target: string }[], retreats: { _id: string }[] } }}
                 */
                const { actions } = data;

                if (!actions.deploys) actions.deploys = [];
                if (!actions.attacks) actions.attacks = [];
                if (!actions.retreats) actions.retreats = [];

                if (
                  updateMatch.battlefield.get(`${user.id}`).length <= 4 &&
                  actions.deploys.length - actions.retreats.length <= 4 &&
                  actions.retreats.length <= 4
                ) {
                  // Retreat cards on the battlefield
                  actions.retreats.forEach((card) => {
                    updateMatch.battlefield.set(
                      `${user.id}`,
                      removeCard(updateMatch.battlefield.get(`${user.id}`), card._id)
                    );
                  });

                  // Deploys cards on the battlefield
                  actions.deploys.forEach((card) => {
                    if (!objInArr(updateMatch.battlefield.get(`${user.id}`), card, '_id')) {
                      // Check if the card position is valid
                      if (
                        card.position >= 0 &&
                        card.position <= 3 &&
                        !objInArr(updateMatch.battlefield.get(`${user.id}`), card, 'position')
                      ) {
                        // Add card to battlefield
                        updateMatch.battlefield.set(`${user.id}`, [
                          ...updateMatch.battlefield.get(`${user.id}`),
                          {
                            operator: new mongo.ObjectId(card._id),
                            position: card.position,
                            statistics: updateMatch.players
                              .get(`${user.id}`)
                              .gameDeck.find((c) => c._id.toString() === card._id).statistics,
                          },
                        ]);

                        // Remove card from user game deck
                        updateMatch.players.set(`${user.id}`, {
                          ...updateMatch.players.get(`${user.id}`).toObject(),
                          gameDeck: updateMatch.players
                            .get(`${user.id}`)
                            .gameDeck.reduce((acc, curr) => {
                              if (curr._id.toString() !== card._id) {
                                acc.push(new mongo.ObjectId(curr._id));
                              }

                              return acc;
                            }, []),
                        });
                      } else {
                        ws.send(action.error('Position already taken'));
                      }
                    } else {
                      ws.send(action.error("You can't put the same card twice"));
                    }
                  });

                  // Get the opponent
                  const opponent = Array.from(updateMatch.players.values()).find(
                    (p) => p.id !== user.id
                  );

                  // Attack cards on the battlefieldupdateMatch
                  actions.attacks.forEach((atk) => {
                    const initiator = updateMatch.battlefield
                      .get(`${user.id}`)
                      .find((c) => c.operator._id.toString() === atk.initiator);

                    let targetIndex = updateMatch.battlefield
                      .get(`${opponent.id}`)
                      .findIndex((c) => c.operator._id.toString() === atk.target);

                    if (targetIndex === -1 && updateMatch.battlefield.get(`${opponent.id}`)[0]) {
                      targetIndex = 0;
                    }

                    if (initiator && targetIndex !== -1) {
                      const target = updateMatch.battlefield.get(`${opponent.id}`)[targetIndex];
                      const targetDef = target.statistics.def;
                      const initiatorAtk = initiator.statistics.atk;

                      const percentReduceAtk =
                        ((targetDef - initiatorAtk) / initiatorAtk) * 100 * -1;

                      if (percentReduceAtk > 75) {
                        target.statistics.hp -= Math.ceil((initiatorAtk * 75) / 100);
                      } else if (percentReduceAtk < 75 && percentReduceAtk > 0) {
                        target.statistics.hp -= Math.ceil(
                          (initiatorAtk * Math.round(percentReduceAtk)) / 100
                        );
                      }

                      if (target.statistics.hp <= 0) {
                        updateMatch.battlefield.set(
                          `${user.id}`,
                          removeCard(updateMatch.battlefield.get(`${opponent.id}`), atk.target)
                        );
                      } else {
                        const updateCard = [...updateMatch.battlefield.get(`${opponent.id}`)];
                        updateCard[targetIndex] = target;
                        updateMatch.battlefield.set(`${opponent.id}`, updateCard);
                      }
                    } else {
                      updateMatch.players.set(`${opponent.id}`, {
                        ...updateMatch.players.get(`${opponent.id}`).toObject(),
                        hp: updateMatch.players.get(`${opponent.id}`).hp - 1,
                      });
                    }
                  });

                  const energyLeft =
                    updateMatch.players.get(`${user.id}`).energy -
                    updateMatch.battlefield
                      .get(`${user.id}`)
                      .reduce((acc, curr) => acc + curr.statistics.cost, 0);

                  if (energyLeft >= 0) {
                    updateMatch.players.set(`${user.id}`, {
                      ...updateMatch.players.get(`${user.id}`).toObject(),
                      energy: energyLeft === 10 ? 10 : energyLeft + 1,
                    });

                    updateMatch.players.set(`${user.id}`, {
                      ...updateMatch.players.get(`${user.id}`).toObject(),
                      energy: energyLeft === 10 ? 10 : energyLeft + 1,
                    });

                    updateMatch.actionTurn = actions;

                    await updateMatch.save();

                    matchs[usersMatch[user.id]].timerTurn.time = 1;
                  } else {
                    ws.send(action.error('Not enough energy'));
                  }
                } else {
                  ws.send(action.error('Preparation phase is over'));
                }
              } else {
                ws.send(action.error("You can't play"));
              }
              break;
            default:
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
