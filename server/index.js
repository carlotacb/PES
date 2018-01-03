const express = require('express')
const app = express()
const morgan = require('morgan')
const db = require('./modules/db')
const mung = require('express-mung');
const achievementModule = require('./modules/achievement')

const config = require('./config')

const BootstrapRouter = require('./routes')


app.use(mung.headersAsync(async function (req, res) {
    if (res.statusCode === 200 && req.username) {
        const headerKey = 'X-New-Achievements'
        const newAchievements = await achievementModule.getNewAchievements(req.username)
        if (newAchievements && Array.isArray(newAchievements) && newAchievements.length > 0) {
            res.setHeader(headerKey, newAchievements.join(','))
        }
    }
}))

BootstrapRouter(app)
BootstrapServer(app)
StartServer(app)


function BootstrapServer(app) {
    if (config.enableMorgan) {
        app.use(morgan('combined'))
    }

    app.use(function (err, req, res, next) {
        console.error(`Error on ${req.method} ${req.path} with request body ${JSON.stringify(req.body)}\n`, err)
        res.status(err.status || 500).json({errorCode: err.errorCode, message: err.message})
    });
}

function StartServer(app) {
    app.listen(config.port, function () {
        console.log(`Agora app listening on port ${config.port}!`)
    })
    connectDBWithRetry()
}

function connectDBWithRetry() {
    db.connect().catch(error => {
        console.error('Error connecting DB. Retrying in 3 seconds...')
        console.error(error)
        setTimeout(connectDBWithRetry, 3000)
    })
}
