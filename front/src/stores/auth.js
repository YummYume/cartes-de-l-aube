import { defineStore } from 'pinia';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

import { getMe, postSignin } from '@/api/auth';
import { asyncToast } from '@/utils/toast';

export const useAuth = defineStore('auth', () => {
  /** @type {Auth} */
  const auth = ref(null);

  /**
   *
   */
  async function signout() {}
  /**
   *
   */
  async function signup() {}

  /** @param {SigninPayload} payload */
  async function signin(payload) {
    // asyncToast(
    //   async () => {
    //     auth.value.me = await postSignin(payload);
    //   },
    //   { successMsg: 'Auth done', pendingMsg: 'Auth pending...' }
    // );
    auth.value.me = await postSignin(payload);
  }

  /**
   *
   */
  async function me() {
    try {
      auth.value.me = await getMe();
    } catch (err) {
      console.log(err);
    }
  }

  return { auth, me, signin };
});
