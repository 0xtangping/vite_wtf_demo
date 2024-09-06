import { createRouter, createWebHistory } from 'vue-router';
import ArticleListView from '../components/ArticleListView.vue';
import ArticleView from '../components/ArticleView.vue';
import LoginView from '../components/LoginView.vue';
import Home from '../components/Home.vue';


const routes = [
  { path: '/', component: Home },
  { path: '/articles', component: ArticleListView },
  { path: '/article/:id', component: ArticleView },
  { path: '/login', component: LoginView }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
