import { defineStore } from 'pinia';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

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
      toast.error(err);
      throw new Error(err);
    }
  }

  /** @param {SigninPayload} payload */
  async function signin(payload) {
    try {
      auth.value = await postSignin(payload);
    } catch (err) {
      toast.error(err);
      throw new Error(err);
    }
  }

  /**
   *
   */
  async function me() {
    try {
      auth.value = await getMe();
    } catch (err) {
      throw new Error(err);
    }
  }

  return { auth, me, signin, signup, signout };
});
