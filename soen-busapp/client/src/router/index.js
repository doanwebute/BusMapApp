import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '../pages/Homepage.vue'
import AllRoutes from '../pages/AllRoutes.vue'
import BusRoute from '../pages/BusRoute.vue'
const routes = [
    {
        path: '/',
        component: Homepage,
    },
    {
        path: '/all-routes',
        component: AllRoutes,
    },
    {
        path: '/bus-route/:id',
        component: BusRoute,
    },
]

export default createRouter({
    history: createWebHistory(),
    routes,
})
