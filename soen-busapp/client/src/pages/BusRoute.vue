<template>
    <main>
        <h1>
            Bus {{ routeNumber }} -
            {{ isForward ? 'forward' : 'backward' }}
        </h1>
        <div class="button-wrapper">
            <button :class="buttonClass" @click="isForward = !isForward">
                See {{ isForward ? 'backward' : 'forward' }}
            </button>
        </div>
        <ul v-if="isForward">
            <li v-for="busStation in routeInfo.firstTurn" :key="busStation">
                <span class="big-dot">
                    <span class="line"></span>
                </span>
                <p>{{ busStation }}</p>
            </li>
        </ul>
        <ul v-else>
            <li v-for="busStation in routeInfo.secondTurn" :key="busStation">
                <span class="big-dot secondary">
                    <span class="line secondary"></span>
                </span>
                <p>{{ busStation }}</p>
            </li>
        </ul>
    </main>
</template>

<script>
export default {
    data: () => ({
        routeNumber: null,
        isForward: true,
        routeInfo: {},
    }),
    created() {
        this.routeNumber = this.$route.params.id
        this.routeInfo = {
            ...this.$store.getters.routeInfo(this.routeNumber),
        }
    },
    computed: {
        buttonClass() {
            return this.isForward ? 'forward' : 'backward'
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
    margin-top: 1rem;
    list-style: none;
    padding-left: 2rem;
    li {
        display: flex;
        align-items: center;
        font-weight: 500;
        font-size: 0.85rem;
        &:not(:first-child) {
            margin-top: 1rem;
        }
        p {
            margin-left: 1.5rem;
        }
    }
}
.big-dot {
    display: inline-block;
    position: relative;
    width: 1rem;
    height: 1rem;
    background: var(--primary);
    border-radius: 100rem;
    &.secondary {
        background: var(--secondary);
    }
    .line {
        display: inline-block;
        position: absolute;
        width: 1.5px;
        height: 2rem;
        left: 50%;
        top: 50%;
        transform: translateX(-50%);
        transform: translateY(-50%);
        background: var(--primary);
        &.secondary {
            background: var(--secondary);
        }
    }
}
.button-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 0.75rem;
    button {
        padding: 0.3rem;

        border-radius: 0.24rem;
        border: none;
        color: #fff;
        cursor: pointer;
        transition: background 0.15s ease;
        &.forward {
            background: var(--secondary);

            &:hover {
                background: #254ab0;
            }
        }
        &.backward {
            background: var(--primary);
            &:hover {
                background: #259f4a;
            }
        }
    }
}
</style>
