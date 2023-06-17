import { defineStore } from 'pinia';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

import { getMe, postSignin, postSignup, postSignout } from '@/api/auth';
import { asyncToast } from '@/utils/toast';

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
    asyncToast(
      async () => {
        auth.value = await postSignup(payload);
      },
      { successMsg: 'Successful Registration ', pendingMsg: 'Pending Registration...' }
    );
  }

  /** @param {SigninPayload} payload */
  async function signin(payload) {
    // asyncToast(
    //   async () => {
    //     auth.value = await postSignin(payload);
    //   },
    //   { successMsg: 'Successful Authenfication ', pendingMsg: 'Pending Authenfication...' }
    // );
    try {
      auth.value = await postSignin(payload);
      console.log('Success');
    } catch (err) {
      console.log(err);
    }
  }

  /**
   *
   */
  async function me() {
    try {
      auth.value = await getMe();
    } catch (err) {
      console.log(err);
    }
  }

  return { auth, me, signin, signup, signout };
});
