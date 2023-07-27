import api from '@/utils/api';

/**
 * Get the leaderboard
 * @param {AbortSignal|null} signal
 * @async
 * @returns {Promise<{ users: User[] }>}
 */
export const getLeaderboard = async (signal = null) => api.get('leaderboard', null, { signal });
