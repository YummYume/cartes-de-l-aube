/**
 * @typedef {{ username: string, password: string, passwordConfirm: string, image: string }} SignupPayload
 * @typedef {{ username: string, password: string }} SigninPayload
 * @typedef {{ username: string, orundum: number }} User
 * @typedef {import('vue').Ref<{ me: User }>} Auth
 * @typedef {typeof import('@/utils/fetchWrap').default} fetchWrap
 */
