import Login from '../pages/Login.vue'
import Main from '../pages/Main.vue'
import GenericComponent from '../components/GenericComponent.vue'
import MvpPrepOrders from '../components/custom/MvpPrepOrders'
import ShowOrder from '../components/custom/mvpPrepOrders/ShowOrder'

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
      },
      // {
      //   path: ':recid/orders',
      //   name: 'orders',
      //   component: MvpPrepOrders
      // },
      // {
      //   path: ':recid/orders/:orderId',
      //   name: 'order-display',
      //   component: ShowOrder,
      //   props: true
      // }
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
