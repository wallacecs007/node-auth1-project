const express = require('express')
const session = require('express-session')
const knexSessionStore = require('connect-session-knex')(session)
const dbConfig = require('./database/dbConfig.js')
const server = express()
const authRouter = require('./auth/auth-router.js')
const userRouter = require('./users/users-router.js')
server.use(express.json())

server.use(session({
    name: 'oatmeal raisan',
    resave: false,
    saveUninitialized: false,
    secret: 'keep it secret, keep it safe',
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 30,
        secure: false,
    },
    store: new knexSessionStore({
        knex: dbConfig,
        createtable: true,
    })
}))

server.use('/auth', authRouter)
server.use('/users', userRouter)

server.get('/', (req, res, next) => {
    res.json({
        message:"Welcome to our API",
    })
})

server.use((err, req, res, next) => {
    console.log('Error:', err)
    res.status(500).json({
        message:'Something went wrong'
    })
})

const port = process.env.PORT || 5000

server.listen(port, () => {
    console.log(`Running on http://localhost:${port}`)
})