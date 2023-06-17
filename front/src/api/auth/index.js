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

/**
 * @async
 * @param {SignupPayload} payload
 * @returns {Promise<User>}
 */
export const postSignup = async (payload) => fetchWrap.post('auth/signup', payload);

/**
 * @async
 * @returns {Promise<Message>}
 */
export const postSignout = async () => fetchWrap.post('auth/signout', {});
