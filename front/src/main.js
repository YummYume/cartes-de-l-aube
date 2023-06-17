import { createPinia } from 'pinia';
import { createApp } from 'vue';
import VueTippy from 'vue-tippy';
import Vue3Toasity, { toast } from 'vue3-toastify';

import App from './App.vue';
import router from './router';

import './assets/styles/tailwind.scss';
import './assets/styles/global.scss';
import 'tippy.js/dist/tippy.css';
import 'vue3-toastify/dist/index.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueTippy, {
  defaultProps: { placement: 'bottom' },
});
app.use(Vue3Toasity, {
  autoClose: 1500,
  position: toast.POSITION.BOTTOM_RIGHT,
  pauseOnHover: false,
});

app.mount('#app');
