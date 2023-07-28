import api from '@/utils/api';

/**
 * Get the history matches of the user
 * @param {AbortSignal|null} signal
 * @async
 * @returns {Promise<{ matches: MatchHistoryPlayer[] }>}
 */
export const getMatchHistories = async (signal = null) => api.get('history', null, { signal });
