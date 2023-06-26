import { createRouter, createWebHistory } from 'vue-router';
import { toast } from 'vue3-toastify';

import { getMatchHistories } from '@/api/history';
import { useAuth } from '@/stores/auth';

import HomeView from '../views/HomeView.vue';

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
      meta: { requiresAuth: true },
      component: () => import('../views/SquadView.vue'),
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

        if (matchHistories) {
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
      path: '/store',
      name: 'store',
      meta: { requiresAuth: true },
      component: () => import('../views/StoreView.vue'),
    },
  ],
});

export const guard = () =>
  router.beforeEach((to, from, next) => {
    const store = useAuth();

    if (to.meta.requiresAuth && !store.auth) next({ name: 'home' });
    else next();
  });

export default router;
