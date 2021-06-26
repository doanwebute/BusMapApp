<template>
    <main>
        <h1>All Ho Chi Minh City's Bus Routes</h1>
        <ul class="all-routes">
            <li v-for="route in routesShortInfo" :key="route.routeNumber">
                <router-link
                    :to="`/bus-route/${route.routeNumber}`"
                    class="link"
                >
                    <div>{{ route.routeNumber }}</div>
                    <p>{{ route.origin }} - {{ route.destination }}</p>
                </router-link>
            </li>
        </ul>
    </main>
    <router-link to="/" class="float-button">
        <span>
            <img src="../assets/home.svg" alt="" />
        </span>
    </router-link>
</template>

<script>
export default {
    created() {
        this.$store.dispatch('getAllRoutes')
    },
    computed: {
        routesShortInfo() {
            return this.$store.getters.routesShortInfo
        },
    },
}
</script>

<style lang="scss" scoped>
h1 {
    font-size: 1.25rem;
    text-align: center;
    color: var(--text);
}

ul {
    list-style: none;
    margin-top: 1.25rem;
}

li {
    padding: 0.4rem 0.8rem;
    border-radius: 0.36rem;

    color: #fff;
    background: var(--primary);
    &:not(:first-child) {
        margin-top: 0.5rem;
    }
    &:hover {
        background: #1bb74a;
    }
    .link {
        display: block;
        width: 100%;
        display: flex;
        align-items: center;
        background: transparent;
        border: none;
        color: inherit;
        text-decoration: none;
        cursor: pointer;
    }
    p {
        margin-left: 2rem;
        font-size: 0.75rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
.float-button {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    right: 2rem;
    bottom: 2rem;
    width: 3.6rem;
    height: 3.6rem;

    background: var(--secondary);
    border-radius: 100rem;
    transition: transform 0.3s ease;
    &:hover {
        transform: translateY(-0.25rem);
    }
    span {
        width: 2rem;
    }
}
</style>
