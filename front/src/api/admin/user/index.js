import api from '@/utils/api';

/**
 * Get all the users
 * @param {number} page
 * @param {AbortSignal|null} signal
 * @async
 * @returns {Promise<{ users: User[], meta: { page: number, totalPage: number, totalCount: number } }>}
 */
export const getUsers = async (page = 1, signal = null) => {
  const url = new URL(`/admin/user`, import.meta.env.VITE_API_HOST);

  url.searchParams.set('page', page);

  return api.get(url, null, { signal });
};

/**
 * Update a user
 * @param {string} id
 * @param {{ password: string | undefined, role: 'user' | 'admin' }} updatedFields
 * @param {AbortSignal|null} signal
 * @async
 * @returns {Promise<User>}
 */
export const updateUser = async (id, updatedFields, signal = null) =>
  api.patch(`admin/user/${id}`, updatedFields, { signal });
