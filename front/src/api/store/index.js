import api from '@/utils/api';

/**
 * Get the store items
 * @param {AbortSignal|null} signal
 * @async
 * @returns {Promise<{ items: StoreItem[] }>}
 */
export const getStoreItems = async (signal = null) => api.get('store', null, { signal });

/**
 * Request a store payment from Stripe
 * @param {number} orderTypeId
 * @param {AbortSignal|null} signal
 * @async
 * @returns {Promise<{ clientSecret: string, id: string }>}
 */
export const requestStorePayment = async (orderTypeId, signal = null) =>
  api.post('store', { orderTypeId }, { signal });

/**
 * Complete a store payment from Stripe
 * @param {string} paymentId
 * @param {AbortSignal|null} signal
 * @async
 * @returns {Promise<{ orundum: number }>}
 */
export const completeStorePayment = async (paymentId, signal = null) =>
  api.patch('store', { paymentId }, { signal });

/**
 * Cancel a store payment from Stripe
 * @param {string} paymentId
 * @param {AbortSignal|null} signal
 * @async
 * @returns {Promise<void>}
 */
export const cancelStorePayment = async (paymentId, signal = null) =>
  api.delete('store', { paymentId }, { signal });
