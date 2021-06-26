const express = require('express')
const app = express()
const axios = require('axios').default
const cors = require('cors')
const allRoutes = require('./allRoutes.json')
const apiKey = ''
app.use(cors())

app.get('/geocode/:queryString', (req, res) => {
    axios
        .get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${req.params.queryString}&key=${apiKey}`
        )
        .then((apiRes) => {
            res.json(apiRes.data)
            console.log(apiRes)
        })
        .catch((err) => console.log(err))
})

app.get('/best-route/:origin/:destination', async (req, res) => {
    axios
        .get(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${req.params.origin}&destination=${req.params.destination}&mode=transit&key=${apiKey}`
        )
        .then((apiRes) => {
            res.json(apiRes.data)
            console.log(apiRes)
        })
        .catch((err) => console.log(err))
})

app.get('/all-routes', (req, res) => {
    res.json(allRoutes)
})

app.listen(3001, () => {
    console.log('http://localhost:3001')
})
