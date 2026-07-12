import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';
import Home from './pages/Home.vue';
import NotFound from './pages/NotFound.vue';

import './index.css';

console.debug('[App] Initializing, BASE_URL:', import.meta.env.BASE_URL);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
  ],
});

router.afterEach((to) => {
  console.debug('[Router] Navigated to:', to.fullPath, '| name:', String(to.name));
});

console.debug('[App] Mounting to #root');
createApp(App).use(router).mount('#root');
console.debug('[App] Mounted');
