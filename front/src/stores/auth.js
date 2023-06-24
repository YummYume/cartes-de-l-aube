import { defineStore } from 'pinia';
import { ref } from 'vue';

import { getMe, postSignin, postSignup, postSignout } from '@/api/auth';

export const useAuth = defineStore('auth', () => {
  /** @type {Auth} */
  const auth = ref(null);

  /**
   *
   */
  async function signout() {
    await postSignout();
    auth.value = null;
  }

  /** @param {SignupPayload} payload */
  async function signup(payload) {
    try {
      auth.value = await postSignup(payload);
    } catch (err) {
      console.log(err);
    }
  }

  /** @param {SigninPayload} payload */
  async function signin(payload) {
    try {
      auth.value = await postSignin(payload);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   *
   */
  async function me() {
    console.log('me');
    try {
      auth.value = await getMe();
    } catch (err) {
      console.log(err);
    }
  }

  return { auth, me, signin, signup, signout };
});
