import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

import './assets/styles/tailwind.postcss';
import './assets/styles/global.scss';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
