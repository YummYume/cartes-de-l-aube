import { createPinia } from 'pinia';
import { createApp } from 'vue';
import VueTippy from 'vue-tippy';

import App from './App.vue';
import router from './router';

import './assets/styles/tailwind.scss';
import './assets/styles/global.scss';
import 'tippy.js/dist/tippy.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueTippy, {
  defaultProps: { placement: 'bottom' },
});

app.mount('#app');
