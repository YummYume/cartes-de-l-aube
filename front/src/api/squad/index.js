import api from '@/utils/api';

/**
 * Get the squad of the user
 * @param {AbortSignal|null} signal
 * @async
 * @returns {Promise<{ squad: Operator[], availableOperators: Operator[] }>}
 */
export const getPlayerSquad = async (signal = null) => api.get('squad', null, { signal });

/**
 * Set the squad of the user
 * @param {string[]} operators
 * @param {AbortSignal|null} signal
 * @async
 * @returns {Promise<{ squad: Operator[], availableOperators: Operator[] }>}
 */
export const setPlayerSquad = async (operators, signal = null) =>
  api.post('squad', { squad: operators }, { signal });
