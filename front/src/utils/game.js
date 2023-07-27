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
 * @typedef {{ type: keyof typeof ACTION_TYPE, message?: string, [key: string]: unknown }} GameEvent
 */
