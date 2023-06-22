import api from '@/utils/api';

/**
 * Pulls random operators
 * @param {number} count
 * @param {AbortSignal|null} signal
 * @async
 * @returns {Promise<{operators: OperatorPull[], orundum: number}>}
 */
export const pull = async (count = 1, signal = null) => api.post('headhunt', { count }, { signal });
