import { defineStore } from 'pinia';
import { ref } from 'vue';

import { getMe, postSignin, postSignup, postSignout } from '@/api/auth';

export const useAuth = defineStore('auth', () => {
  /** @type {Auth} */
  const auth = ref(null);

  /**
   * Signout the user.
   */
  async function signout() {
    await postSignout();
    auth.value = null;
  }

  /** @param {SignupPayload} payload */
  async function signup(payload) {
    auth.value = await postSignup(payload);
  }

  /** @param {SigninPayload} payload */
  async function signin(payload) {
    auth.value = await postSignin(payload);
  }

  /**
   * Fetch the user data.
   */
  async function me() {
    try {
      auth.value = await getMe();
    } catch (err) {
      auth.value = null;
    }
  }

  return { auth, me, signin, signup, signout };
});
