import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
// Import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// Import Toast plugin and its styles to show popup notifications (toasts)
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
// Import the router to handle page navigation in the app
import router from './router';
// Import Pinia, which is a state management library to manage app data globally
import { createPinia } from 'pinia';

const app = createApp(App);

// Register Pinia plugin to use global state management in the app
app.use(createPinia());
// Register router plugin to enable navigation in the app
app.use(router);
// Register Toast plugin to allow showing notification popups anywhere in the app
app.use(Toast);

app.mount('#app');
