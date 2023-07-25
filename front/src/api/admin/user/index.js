import api from '@/utils/api';

/**
 * Get all the users
 * @param {number} page
 * @param {AbortSignal|null} signal
 * @async
 * @returns {Promise<{ squad: Operator[], availableOperators: Operator[] }>}
 */
export const getUsers = async (page = 1, signal = null) =>
  api.get(new URL('admin/user', { searchParams: { page } }), null, { signal });

/**
 * Update a user
 * @param {{ password: string | undefined, role: 'user' | 'admin' }} updatedFields
 * @param {AbortSignal|null} signal
 * @async
 * @returns {Promise<User>}
 */
export const updateUser = async (updatedFields, signal = null) =>
  api.put('admin/user', updatedFields, { signal });
