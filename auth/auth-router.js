const bcrypt = require('bcryptjs')
const express = require('express')

const users = require('../users/users-model.js')

const router = express.Router()

router.post('/register', async(req, res, next) => {
    
    const user = req.body;

    // const hash = bcrypt.hashSync(user.password, 10) // 2^10
    // user.password = hash;

    users.add(user)
        .then(saved => {
            res.status(201).json(saved)
        })
        .catch (err => {
            res.status(500).json({message: `Failed to register for: ${err}`})
        })

})

router.post('/login', async(req, res, next) => {

    try {
        const {username, password} = req.body;

        console.log(username)

        const user = await users.findBy({username}).first()
        const passwordValid = await bcrypt.compare(password, user.password)

        if(user && passwordValid) {
            res.status(200).json({
                message: `User ${username} authenticated.`
            })
        } else {
            res.status(401).json({message: `Authentication Failed`})
        }

        // users.findBy({username}).first()
        // .then(user => {
        //     if(user && bcrypt.compareSync(password, user.password)) {
        //         req.session.user = user;
        //         res.status(200).json({message: `User ${username} authenticated.`})
        //     } else {
        //         res.status(401).json({message: `Authentication Failed`})
        //     }
        // })
        // .catch(err => {
        //     res.status(500).json({message: `Failed to authenticate.`})
        // })
    } catch (err) {
        next(err)
    }

})

module.exports = router