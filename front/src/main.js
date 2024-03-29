import { createHead } from '@unhead/vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createRouterScroller } from 'vue-router-better-scroller';
import VueTippy, { roundArrow } from 'vue-tippy';
import Vue3Toasity, { toast } from 'vue3-toastify';

import App from './App.vue';
import id from './plugins/unique-id';
import router from './router';
import { initStripe } from './stripe';

import './assets/styles/tailwind.scss';
import './assets/styles/global.scss';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/svg-arrow.css';
import 'vue3-toastify/dist/index.css';
import './assets/styles/nprogress.scss';

const app = createApp(App);
const head = createHead();

app.use(createPinia());
app.use(router);
app.use(
  createRouterScroller({
    selectors: {
      '#main-content': true,
    },
    behavior: 'smooth',
  })
);
app.use(VueTippy, {
  defaultProps: { placement: 'bottom', arrow: roundArrow },
});
app.use(Vue3Toasity, {
  autoClose: 5000,
  position: toast.POSITION.BOTTOM_LEFT,
  pauseOnHover: true,
});
app.use(head);
app.use(id);

router.isReady().then(() => {
  initStripe()
    .catch(() => {
      // eslint-disable-next-line no-console
      console.error('Failed to initialize Stripe, payment will not work.');
    })
    .finally(() => {
      app.mount('#app');
    });
});
