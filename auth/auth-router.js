const bcrypt = require('bcryptjs')
const express = require('express')

const users = require('../users/users-model.js')

const router = express.Router()

router.post('/register', async(req, res, next) => {
    
    let user = req.body;

    const hash = bcrypt.hashSync(user.password, 10) // 2^10
    user.password = hash;

    users.add(user)
        .then(saved => {
            res.status(201).json(saved)
        })
        .catch (err => {
            res.status(500).json({message: `Failed to register for: ${err}`})
        })

})

router.post('/login', async(req, res) => {

    let {username, password} = req.body;

     users.findBy(username).first()
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)) {
                req.session.user = user;
                res.status(200).json({message: `User ${username} authenticated.`})
            } else {
                res.status(401).json({message: `Authentication Failed`})
            }
        })
        .catch(err => {
            res.status(500).json({message: `Failed to register for: ${err}`})
        })


})

module.exports = router