import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
    state() {
        return {
            allRoutes: [],
            a: '10',
        }
    },
    mutations: {
        GET_ALL_ROUTES(state, allRoutes) {
            state.allRoutes = [...allRoutes]
        },
    },
    actions: {
        getAllRoutes({ commit }) {
            const allRoutes = []
            axios
                .get('http://localhost:3001/all-routes')
                .then((res) => {
                    res.data.map((route) => {
                        const firstTurn = route.firstTurn
                            ? route.firstTurn.split('-')
                            : null
                        const secondTurn = route.secondTurn
                            ? route.secondTurn.split('-')
                            : null
                        allRoutes.push({
                            routeNumber: route.routeNumber,
                            firstTurn: firstTurn,
                            secondTurn: secondTurn,
                        })
                    })
                    commit('GET_ALL_ROUTES', allRoutes)
                })
                .catch((err) => console.log(err))
        },
    },
    getters: {
        routesShortInfo(state) {
            const routes = []
            state.allRoutes.map((route) => {
                const routeShortInfo = {
                    routeNumber: route.routeNumber,
                    origin: route.firstTurn[0],
                    destination: route.firstTurn[route.firstTurn.length - 1],
                }
                routes.push(routeShortInfo)
            })
            return routes
        },
        routeInfo: (state) => (routeNumber) => {
            const routeNumberConverted = routeNumber.toString()
            return state.allRoutes.find(
                (route) => route.routeNumber.toString() === routeNumberConverted
            )
        },
    },
})
