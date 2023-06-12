import fetchWrap from '@/utils/fetchWrap';

/**
 * @async
 * @returns {Promise<User>}
 */
export const getMe = async () => fetchWrap.get('auth/me');

/**
 * @async
 * @param {SigninPayload} payload
 * @returns {Promise<User>}
 */
export const postSignin = async (payload) => fetchWrap.post('auth/signin', payload);
