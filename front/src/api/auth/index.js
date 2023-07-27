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

/**
 * Update the current user
 * @param {{ password: string | undefined }} updatedFields
 * @param {AbortSignal|null} signal
 * @async
 * @returns {Promise<User>}
 */
export const updateUser = async (updatedFields, signal = null) =>
  api.patch(`auth/me`, updatedFields, { signal });
