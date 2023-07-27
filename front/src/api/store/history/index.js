import api from '@/utils/api';

/**
 * Get the payment history of the current user
 * @param {AbortSignal|null} signal
 * @async
 * @returns {Promise<{ payments: Payment[] }>}
 */
export const getPayments = async (signal = null) => api.get('store/history', null, { signal });
