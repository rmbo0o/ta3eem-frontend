import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/components/Auth/Login.vue'
import Register from '@/components/Auth/Register.vue'
import Dashboard from '@/views/Dashboard.vue'
import DashboardProfile from '@/views/DashboardProfile.vue'
import FamousFoodTypes from '@/components/FamousFoodTypes.vue'
import AllOwners from "@/views/AllOwners.vue";
import About from '@/views/About.vue'
import Contact from '@/views/Contact.vue'
// import OwnerProfileView from '@/views/OwnerProfileView.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/', component: FamousFoodTypes },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }  // Optional: Mark as protected route
  },
  {
    path: '/menu',
    component: () => import('@/views/MenuView.vue'), // Points to view
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'DashboardProfile',
    component: DashboardProfile, // The profile management component
    meta: { requiresAuth: true }  // Optional: Only accessible by authenticated users
  },
  {
    path: '/owner/:id/menu',
    name: 'OwnerMenuView',
    component: () => import('@/views/MenuView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/owner/:id',
    name: 'OwnerProfileView',
    component: () => import('@/views/OwnerProfileView.vue'),
    meta: { requiresAuth: false } // public route
  },
  {
    path: "/owners",
    name: "AllOwners",
    component: AllOwners,
  },
   {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {
        path: '',
        name: 'famous-food',
        component: FamousFoodTypes
      }
    ]
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!localStorage.getItem('token')) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});


export default router
