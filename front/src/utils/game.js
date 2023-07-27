export const ACTION_TYPE = {
  running: 'running',
  victory: 'victory',
  defeat: 'defeat',
  finish: 'finish',
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

/**
 * @template T extends Record<string, unknown>
 * @typedef {{ type: keyof typeof ACTION_TYPE } & T} GameEvent
 */

/**
 * @typedef {{
 *   deploys: { _id: string, position: number }[],
 *   attacks: { initiator: string, target: string }[],
 *   retreats: { _id: string, position: number }[],
 * }} ActionTurn
 */

/**
 * @typedef {{
 *   operator: Operator,
 *   statistics: {
 *     hp: number,
 *     atk: number,
 *     def: number,
 *     cost: number,
 *   },
 *   position: number,
 * }} FieldOperator
 */

/**
 * @typedef {{
 *    status: 'running' | 'waiting' | 'preparation' | 'surrender' | 'victory' | 'defeat',
 *    playerTurn: number,
 *    totalTurn: number,
 *    actionTurn: ActionTurn,
 *    user: {
 *      id: number,
 *      hp: number,
 *      username: string,
 *      energy: number,
 *      deck: string[],
 *      gameDeck: Operator[],
 *      battlefield: FieldOperator[],
 *    },
 *    opponent: {
 *      id: number,
 *      hp: number,
 *      username: string,
 *      energy: number,
 *      battlefield: FieldOperator[],
 *    },
 *  }} GameState
 */
