const express = require('express');
const { authMiddleWare } = require('../middleware');
const router = express.Router();
const {Account} = require('../db')

router.get('/balance', authMiddleWare, async (req, res) => {
    try {
        const account = await Account.findOne({userId: req.userId})
        return res.json({
            balance: account.balance
        })
    } catch (error) {
        return res.status(404).json({
            message: "Something went wrong"
        })
    }
})



module.exports = {
    router
}