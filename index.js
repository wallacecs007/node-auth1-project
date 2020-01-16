const express = require('express')

const port = process.env.PORT || 5000
const server = express()

server.use(express.json())



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

server.listen(port, () => {
    console.log(`Running on http://localhost:${port}`)
})