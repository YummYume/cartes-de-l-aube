import api from '@/utils/api';

/**
 * @async
 * @returns {Promise<User>}
 */
export const getMe = async () => api.get('auth/me');

/**
 * @async
 * @param {SigninPayload} payload
 * @returns {Promise<User>}
 */
export const postSignin = async (payload) => api.post('auth/signin', payload);

/**
 * @async
 * @param {SignupPayload} payload
 * @returns {Promise<User>}
 */
export const postSignup = async (payload) => api.post('auth/signup', payload);

/**
 * @async
 * @returns {Promise<Message>}
 */
export const postSignout = async () => api.post('auth/signout', {});
