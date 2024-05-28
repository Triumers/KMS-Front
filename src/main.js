import './assets/main.css';

// npm install vue bootstrap bootstrap-vue-3
// npm install axios
// npm install vue-router@next

import { createApp } from 'vue';
import router from './router/mainRouter.js';
import App from './App.vue';

import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

import axios from 'axios';

const app = createApp(App);
app.use(router);
app.use(BootstrapVue3);
app.mount('#app');