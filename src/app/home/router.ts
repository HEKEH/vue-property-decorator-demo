import VueRouter, { RouteConfig } from 'vue-router'

const Dashboard = () => import("./Home").then(module => module.Home)

const routes: RouteConfig[] = [
  {
    path: '/',
    redirect: "/dashboard",
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    props() {
        return {
            title: "hahaha",
        }
    },
  },
]

const router = new VueRouter({
    routes
})

export default router