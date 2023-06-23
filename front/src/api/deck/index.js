import api from '@/utils/api';

/**
 * Get the history matches of the user
 * @param {AbortSignal|null} signal
 * @async
 * @returns {Promise<{ matches: MatchHistory[] }>}
 */
export const getPlayerDeck = async (signal = null) => api.get('deck', null, { signal });
