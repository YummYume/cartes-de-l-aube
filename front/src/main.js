import { createHead } from '@unhead/vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import VueTippy, { roundArrow } from 'vue-tippy';
import Vue3Toasity, { toast } from 'vue3-toastify';

import App from './App.vue';
import id from './plugins/unique-id';
import router from './router';

import './assets/styles/tailwind.scss';
import './assets/styles/global.scss';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/svg-arrow.css';
import 'vue3-toastify/dist/index.css';

const app = createApp(App);
const head = createHead();

app.use(createPinia());
app.use(router);
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

await router.isReady();

app.mount('#app');
