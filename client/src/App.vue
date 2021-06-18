<template>
    <div>
        <the-header />
        <router-view />
    </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

:root {
    --primary: #2fc15b;
    --secondary: #2e5bd6;
    --text: #323232;
}

* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
}
body {
    margin-left: 1rem;
    margin-right: 1rem;
}
main {
    margin-top: 1rem;
}
</style>

<script>
import TheHeader from './components/layouts/TheHeader.vue'
export default {
    components: {
        TheHeader,
    },
}
</script>
