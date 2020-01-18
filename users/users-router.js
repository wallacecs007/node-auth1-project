const bcrypt = require('bcryptjs')
const express = require('express')
const userModel = require('./users-model')

const router = express.Router() 

function restricted() {

    const authError = {
        message: "Invalid credentials",
    }

    return async(req, res, next) => {
        try {
            const { username, password } = req.headers

            if(!username || !password ) {
                return res.status(401).json(authError)
            }

            const user = await userModel.findBy({username}).first()

            if(!user) {
                return res.status(401).json(authError)
            }

            const passwordValid = await bcrypt.compare(password, user.password)

            if(!passwordValid) {
                return res.status(401).json(authError)
            }

            next()


        } catch (err) {
            next(err)
        }
    }

}

router.get('/', restricted(), (req, res) => {
    userModel.find()
        .then(users => {
            res.status(201).json(users)
        })
        .catch(err => {
            res.status(500).json({message: `Could not retrieve users: ${err}`})
        })
})

module.exports = router;