import { createRouter, createWebHashHistory } from 'vue-router'
import Start from '../components/Start/Start.vue'
import Test from '../components/Test/Test.vue'
import Editor from '../components/Development/Editor.vue'
import Login from '../components/Login/Login.vue'
import Register from '../components/Login/Register.vue'
import Development from '../components/Development/Development.vue'
import About from '../components/About/About.vue'
import Gaming from '../components/Game/Gaming.vue'
import Welcome from '../components/Welcome/Welcome.vue'
import Terms from '../components/About/Terms.vue'
import Kontakt from '../components/About/Kontakt.vue'
require('../css/master.css')
const routes = [
  {
    path: '/',
    name: 'Start',
    component: Start
  },
  {path:'/login',
    name: 'Login',
    component:Login
  },
  {path:'/register',
    name:'Register',
    component:Register
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/test/:id',
    name: 'Test',
    component: Test,
  },
  {
    path: '/editor',
    name: 'Editor',
    component: Editor,
  },
  {
    path: '/development',
    name: 'Development',
    component: Development,
  },
  {
    path: '/gaming',
    name: 'Gaming',
    component: Gaming,
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: Welcome,
  },
  {
    path: '/terms',
    name: 'Terms',
    component: Terms,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/kontakt',
    name: 'kontakt',
    component: Kontakt,
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
