export const ACTION_TYPE = {
  'finish': 'finish',
  'timer-turn': 'timerTurn',
  'timer-surrender': 'timerSurrender',
  'timer-preparation': 'timerPreparation',
  'opponent-left': 'opponentLeft',
  'error': 'error',
  'waiting': 'waiting',
  'preparation-phase': 'preparationPhase',
  'turn-phase': 'turnPhase',
  'reconnect': 'reconnect',
};

/**
 * @template T extends Record<string, unknown> = {}
 * @typedef {{ type: keyof typeof ACTION_TYPE } & T} GameEvent
 */

/**
 * @typedef {{
 *    deploys: string[],
 *    attacks: { initiator: string, target: string | null }[],
 * }} ActionTurn
 */

/**
 * @typedef {{
 *    operator: Operator & { _id: string },
 *    statistics: {
 *      hp: number,
 *      atk: number,
 *      def: number,
 *      cost: number,
 *    },
 * }} FieldOperator
 */

/**
 * @typedef {{
 *    time: number,
 * }} GameTimer
 */

/**
 * @typedef {{
 *    message: string,
 * }} GameError
 */

/**
 * @typedef {{
 *    result: 'win' | 'lose',
 * }} GameResult
 */

/**
 * @typedef {{
 *    status: 'running' | 'waiting' | 'finish',
 *    playerTurn: number,
 *    totalTurn: number,
 *    actionTurn: ActionTurn,
 *    user: {
 *      id: number,
 *      hp: number,
 *      username: string,
 *      energy: number,
 *      deck: string[],
 *      gameDeck: (Operator & { _id: string })[],
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
