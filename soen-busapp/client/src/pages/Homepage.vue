<template>
    <div>
        <h1>Let us find the best route for you!</h1>
        <form @submit.prevent spellcheck="false">
            <label>
                <p>Start location:</p>
                <div class="gps-input">
                    <input
                        type="text"
                        v-model="origin"
                        @input="isValid = true"
                    />
                    <img
                        src="../assets/gps.svg"
                        alt=""
                        class="gps-button"
                        @click="getCurrentLocation"
                    />
                </div>
            </label>
            <label>
                <p>Destination:</p>
                <input
                    type="text"
                    v-model="destination"
                    @input="isValid = true"
                />
            </label>
            <p class="invalid" v-if="!isValid">
                Please type a valid address with length is greater than 1
            </p>
            <div class="button-wrapper">
                <button @click="handleFindRoute">Find now</button>
            </div>
        </form>
        <div class="separate"></div>

        <!-- result -->
        <div
            v-if="status === 'finding-route' || status === 'done'"
            class="result"
        >
            <h2>Here is the result</h2>
            <div class="result-addresses">
                <div class="result-address">
                    <img
                        src="../assets/pin.svg"
                        width="27"
                        height="27"
                        alt=""
                    />
                    <p>{{ absoluteOrigin }}</p>
                </div>
                <div class="result-address" style="margin-top: 0.5rem">
                    <img
                        src="../assets/location.svg"
                        width="27"
                        height="27"
                        alt=""
                    />
                    <p>{{ absoluteDestination }}</p>
                </div>
                <p class="route-not-found" v-if="hasNoRoute">
                    Cannot found any route!
                </p>
            </div>
            <div class="result-route" v-if="status === 'done'">
                <div>
                    <img
                        src="../assets/bus-2.svg"
                        width="24"
                        height="24"
                        alt=""
                    />
                    <p>Bus {{ busesNumber }}</p>
                </div>
                <div>
                    <img
                        src="../assets/dollar.svg"
                        alt=""
                        width="24"
                        height="24"
                    />
                    <p>
                        {{ bestRoute.fare.value }} {{ bestRoute.fare.currency }}
                    </p>
                </div>
                <div>
                    <img
                        src="../assets/distance.svg"
                        alt=""
                        width="24"
                        height="24"
                    />
                    <p>{{ bestRoute.legs[0].distance.text }}</p>
                </div>
                <div>
                    <img
                        src="../assets/clock.svg"
                        alt=""
                        width="24"
                        height="24"
                    />
                    <p>About {{ bestRoute.legs[0].duration.text }}</p>
                </div>
                <h3 class="instruction-header">Details instruction:</h3>
                <ul class="instruction-list">
                    <li v-for="step in steps">
                        <div v-if="step.mode === 'bus'">
                            <img src="../assets/bus-3.svg" alt="" width="27" />
                        </div>
                        <div v-else>
                            <img
                                src="../assets/walking.svg"
                                alt=""
                                width="27"
                            />
                        </div>
                        <p>
                            {{ step.instruction }}
                            <span>{{ step.distance }}</span> in about
                            {{ step.duration }}
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <router-link to="/all-routes" class="float-button">
        <span>
            <img src="../assets/bus.svg" alt="" />
        </span>
    </router-link>
</template>

<script>
import axios from 'axios'
export default {
    data: () => ({
        origin: '',
        destination: '',
        absoluteOrigin: '',
        absoluteDestination: '',
        bestRoute: {},
        currentLocation: '',
        isValid: true,
        hasNoRoute: false,
        status: 'waiting',
    }),
    computed: {
        busesNumber() {
            const steps = this.bestRoute.legs[0].steps
            const transitSteps = [
                ...steps.filter((step) => step.travel_mode === 'TRANSIT'),
            ]
            console.log(transitSteps)
            let busesNumberString = ''
            transitSteps.map((step) => {
                busesNumberString += ` - ${step.transit_details.line.short_name}`
            })
            return busesNumberString
        },
        steps() {
            const steps = [
                ...this.bestRoute.legs[0].steps.map((step) => {
                    return {
                        distance: step.distance.text,
                        duration: step.duration.text,
                        instruction: step.html_instructions,
                        mode:
                            step.travel_mode === 'TRANSIT' ? 'bus' : 'walking',
                    }
                }),
            ]
            return steps
        },
    },
    methods: {
        handleFindRoute() {
            this.hasNoRoute = false
            if (this.origin.length < 2 || this.destination.length < 2) {
                this.isValid = false
                return
            }
            this.status = 'finding-geo'

            let originQueryString = this.origin.split(' ').join('+')
            let destinationQueryString = this.destination.split(' ').join('+')

            axios
                .get(
                    `http://localhost:3001/geocode/${
                        this.origin === 'Your location'
                            ? this.currentLocation
                            : originQueryString
                    }`
                )
                .then((res) => {
                    this.absoluteOrigin = res.data.results[0].formatted_address
                    axios
                        .get(
                            `http://localhost:3001/geocode/${destinationQueryString}`
                        )
                        .then((res) => {
                            this.absoluteDestination =
                                res.data.results[0].formatted_address
                            this.status = 'finding-route'
                            this.getTheBestRoute(
                                originQueryString,
                                destinationQueryString
                            )
                        })
                        .catch((err) => console.log(err))
                })
                .catch((err) => console.log(err))
        },
        getTheBestRoute(origin, destination) {
            axios
                .get(
                    `http://localhost:3001/best-route/${origin}/${destination}`
                )
                .then((res) => {
                    if (!res.data.routes.length) {
                        this.hasNoRoute = true
                        return
                    }
                    this.bestRoute = { ...res.data.routes[0] }
                    console.log(this.bestRoute)
                    this.status = 'done'
                })
                .catch((err) => console.log(err))
        },
        getCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.currentLocation = `${position.coords.latitude},${position.coords.longitude}`
                    this.origin = 'Your location'
                })
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.float-button {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    right: 2rem;
    bottom: 2rem;
    width: 3.6rem;
    height: 3.6rem;

    background: var(--primary);
    border-radius: 100rem;
    transition: transform 0.3s ease;
    &:hover {
        transform: translateY(-0.25rem);
    }
    span {
        width: 2rem;
        transform: translateY(-0.25rem);
    }
}

h1 {
    font-size: 1.25rem;
    text-align: center;
    color: var(--text);
}
h2 {
    font-size: 1.1rem;
    text-align: center;
    color: var(--secondary);
}
form {
    max-width: 24rem;
    margin: 1.5rem auto 0;
    border-radius: 0.45rem;
    box-shadow: 2px 2px 10px rgba(25, 25, 25, 0.4);
    padding: 1.5rem 2.5rem;
    p.invalid {
        display: block;
        margin-top: 0.5rem;
        color: #ca4545;
        font-size: 0.72rem;
    }
    .button-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 0.72rem;
    }
    button {
        padding: 0.3rem 3rem;
        border-radius: 0.24rem;
        text-transform: uppercase;
        font-weight: 500;
        border: none;
        color: #fff;
        cursor: pointer;
        transition: background 0.15s ease;
        background: var(--primary);
        &:hover {
            background: #259f4a;
        }
    }
}
label {
    display: block;
    &:not(:first-child) {
        margin-top: 0.81rem;
    }
    p {
        font-size: 0.8rem;
    }
    input {
        display: block;
        margin-top: 0.36rem;
        width: 100%;
        padding: 0.3rem 0.5rem;
        border: 1px solid var(--primary);
        border-radius: 0.36rem;
        font-size: 0.85rem;
        font-weight: 500;
        outline: none;
        &:focus {
            box-shadow: 0 0 4px var(--primary);
        }
    }
}
.separate {
    height: 1px;
    width: 75%;
    margin: 1.5rem auto;
    background: var(--secondary);
}
.result {
    p {
        font-size: 0.8rem;
        margin-left: 0.63rem;
    }
    .result-addresses {
        margin-top: 1rem;
        .result-address {
            display: flex;
            align-items: center;
        }
    }

    .result-route {
        margin-top: 0.5rem;
        div {
            display: flex;
            align-items: center;
            &:not(:first-child) {
                margin-top: 0.25rem;
            }
        }
    }
}
.route-not-found {
    display: block;
    margin-top: 0.75rem;
    color: #ca4545;
}
.instruction-header {
    margin-top: 0.5rem;
    color: var(--secondary);
    font-size: 1.1rem;
    text-align: center;
}
.instruction-list {
    margin-top: 1rem;
    list-style: none;
    li {
        margin-top: 0.5rem;
        display: flex;
        align-items: center;
    }
    p span {
        color: var(--secondary);
    }
}
.gps-input {
    display: flex;
    align-items: center;
}
.gps-button {
    display: inline-block;
    margin-left: 0.5rem;
    width: 24px;
    cursor: pointer;
    &:hover {
        transform: scale(1.1);
    }
}
</style>
