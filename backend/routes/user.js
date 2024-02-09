const express = require('express')
const z = require('zod')
const jwt = require('jsonwebtoken')
const router = express.Router();
const {User} = require('../db')
const {JWT_SECRET} = require('../config')

const signupBody = z.object({
    username: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string()
})

router.post('/signup', async(req, res) => {
    const { success } = signupBody.safeParse(req.body)

    if(!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if(existingUser) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    let user;
    try {
        user = await User.create({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password
        })
    } catch (error) {
        return res.status(411).json({
            message: "User Already Exists"
        })
    }
    

    const userId = user._id
    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    return res.json({
        message: "User successfully Created",
        token
    })
});

const signinBody = z.object({
    username: z.string().email(),
    password: z.string(),
})

router.post('/signin', async (req, res) => {
    const {success} = signinBody.safeParse(req.body)
    if(!success) {
        return res.status(411).json({
            message: "Error while logging in"
        })
    }
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })

    if(!user) {
        return res.status(411).json({
            message: "Error while logging in"
        })
    }

    const token = jwt.sign({
        username: user.username,
        password: user.password
    }, JWT_SECRET)

    res.json({
        token
    })
})

module.exports = {
    router
}