const express = require('express')
const z = require('zod')
const jwt = require('jsonwebtoken')
const router = express.Router();
const {User, Account} = require('../db')
const {JWT_SECRET} = require('../config')
const {authMiddleWare} = require('../middleware')

const signupBody = z.object({
    username: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string()
})

// Sign Up Route
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

        account = await Account.create({
            userId: user._id,
            balance: 1 + Math.random() * 10000,
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

// Signin Route
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
        userId: user._id
    }, JWT_SECRET)

    res.json({
        token
    })
    return
})

// Update Route
const updateBody = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    password: z.string().optional()
})

router.put('/', authMiddleWare, async (req, res) => {
    const {success} = updateBody.safeParse(req.body)
    if(!success) {
        return res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({_id: req.userId}, req.body)

    res.json({
        message: "Updated successfully"
    })
})

// Filterable get users route 
router.get('/bulk', async (req, res) => {
    const {filter} = req.query
    try {
        const users = await User.find({
            $or: [{
                firstName: {
                    "$regex": filter
                }
            }, {
                lastName: {
                    "$regex": filter
                }
            }]
        })
        res.json({
            users
        })
    } catch (error) {
        res.status(411).json({
            message: "Something went wrong"
        })
    }
})

module.exports = {
    router
}
