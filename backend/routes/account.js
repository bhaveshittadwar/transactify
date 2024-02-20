const express = require('express');
const { authMiddleWare } = require('../middleware');
const router = express.Router();
const {Account} = require('../db');
const { mongo, default: mongoose } = require('mongoose');

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

router.post('/transfer', authMiddleWare, async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    const {amount, to} = req.body

    const account = await Account.findOne({userId: req.userId}).session(session)

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
})

module.exports = {
    router
}