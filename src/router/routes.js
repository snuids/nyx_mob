import Login from '../pages/Login.vue'
import Main from '../pages/Main.vue'
import GenericComponent from '../components/GenericComponent.vue'


const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/main',
    name: 'Main',
    component: Main,
    children: [
      {
        path: ':recid',
        name: 'GenericComponent',
        component: GenericComponent
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
