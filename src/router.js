import Vue from 'vue'
import Router from 'vue-router'


const Login = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Login.vue')

const Home = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Home.vue')

const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Welcome.vue')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ './components/user/Users.vue')

const Userinfo = () => import(/* webpackChunkName: "Users_Rights_Roles" */ './components/user/Userinfo.vue')

const MyList = () => import(/* webpackChunkName: "GoodsList_Add" */ './components/goods/MyList.vue')

const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ './components/goods/Add.vue')

const AllList = () => import(/* webpackChunkName: "Order_Report" */ './components/goods/AllList.vue')

const Notice = () => import(/* webpackChunkName: "Order_Report" */ './components/life/Notice.vue')

const Circle = () => import(/* webpackChunkName: "Order_Report" */ './components/life/Circle.vue')

const Music = () => import(/* webpackChunkName: "Order_Report" */ './components/video/Music.vue')

const Movie = () => import(/* webpackChunkName: "Order_Report" */ './components/video/Movie.vue')

const Phone = () => import(/* webpackChunkName: "Order_Report" */ './components/pay/Phone.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/phone', component: Phone },
        { path: '/movie', component: Movie },
        { path: '/music', component: Music },
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/userinfo', component: Userinfo },
        { path: '/mygoods', component: MyList },
        { path: '/goods/add', component: Add },
        { path: '/allgoods', component: AllList },
        { path: '/notice', component: Notice },
        { path: '/circle', component: Circle },
      ]
    }
  ]
})


router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
