import nprogress from 'accessible-nprogress';
import { createRouter, createWebHistory } from 'vue-router';
import { toast } from 'vue3-toastify';

import { getMatchHistories } from '@/api/history';
import { getPlayerSquad } from '@/api/squad';
import { getStoreItems } from '@/api/store';
import { useAuth } from '@/stores/auth';

import HomeView from '../views/HomeView.vue';

nprogress.configure({
  showSpinner: false,
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/play',
      name: 'play',
      meta: { requiresAuth: true },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/PlayView.vue'),
    },
    {
      path: '/squad',
      name: 'squad',
      props: true,
      meta: { requiresAuth: true },
      component: () => import('../views/SquadView.vue'),
      beforeEnter: async (to, from, next) => {
        /**
         * @type {Awaited<ReturnType<getPlayerSquad>>|null}
         */
        let res = null;

        try {
          res = await getPlayerSquad();
        } catch (error) {
          toast.error('Sorry, something went wrong while fetching your squad.');
        }

        if (res !== null) {
          to.params.squad = res.squad;
          to.params.availableOperators = res.availableOperators;

          next();

          return;
        }

        next(false);
      },
    },
    {
      path: '/history',
      name: 'history',
      props: true,
      meta: { requiresAuth: true },
      component: () => import('../views/HistoryView.vue'),
      beforeEnter: async (to, from, next) => {
        /**
         * @type {{ matches: MatchHistory[] }|null}
         */
        let matchHistories = null;

        try {
          matchHistories = await getMatchHistories();
        } catch (error) {
          toast.error('Sorry, something went wrong while fetching your match histories.');
        }

        if (matchHistories !== null) {
          to.params.matchHistories = matchHistories.matches;

          next();

          return;
        }

        next(false);
      },
    },
    {
      path: '/headhunt',
      name: 'headhunt',
      meta: { requiresAuth: true },
      component: () => import('../views/HeadhuntView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      meta: { requiresAuth: true, requiresAdmin: true },
      component: () => import('../views/AdminView.vue'),
    },
    {
      path: '/store',
      name: 'store',
      props: true,
      meta: { requiresAuth: true },
      component: () => import('../views/StoreView.vue'),
      beforeEnter: async (to, from, next) => {
        /**
         * @type {Awaited<ReturnType<getStoreItems>>|null}
         */
        let res = null;

        try {
          res = await getStoreItems();
        } catch (error) {
          toast.error('Oops, the store is currently unavailable. Please try again later.');
        }

        if (res !== null) {
          to.params.items = res.items;

          next();

          return;
        }

        next(false);
      },
    },
  ],
});

let initialized = false;
let progressBarTimeout = null;

router.beforeEach(async (to, from, next) => {
  if (from.name) {
    window.clearTimeout(progressBarTimeout);
    progressBarTimeout = window.setTimeout(() => {
      nprogress.start();
    }, 100);
  }

  if (!initialized) {
    await useAuth().me();

    initialized = true;
  }

  const store = useAuth();

  if (to.meta.requiresAuth && !store.auth) {
    next({ name: 'home' });
  } else if (to.meta.requiresAdmin && store.auth.role !== 'admin') {
    next({ name: 'home' });
  } else {
    next();
  }
});

router.afterEach(() => {
  window.clearTimeout(progressBarTimeout);
  nprogress.done();
});

export default router;
