<template>
    <header>
        <router-link to="/" class="logo-wrapper">
            <div><img src="../../assets/logo.svg" alt="" /></div>
            <h2>BRF</h2>
        </router-link>
        <div></div>
    </header>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Satisfy&display=swap');

header {
    margin-top: 0.75rem;
}

.logo-wrapper {
    display: flex;
    text-decoration: none;
    align-items: center;

    div {
        width: 2.75rem;
    }

    h2 {
        margin-left: 0.5rem;

        font-size: 1.2rem;
        font-family: 'Satisfy', cursive;
        color: var(--primary);
    }
}
</style>
