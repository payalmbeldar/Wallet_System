const mongoose = require('mongoose')
const { WalletModel } = require('./wallet_service.js');
const { app } = require('./service.js')
const { Transaction } = require('./transaction.js')
const axios = require('axios');  // Add this line to import Axios
const express = require('express');
const cors = require('cors'); // Import cors

app.use(express.json());
app.use(cors());


app.post('/setup', async (req, res) => {
    const { balance, name } = req.body;
    console.log("request-->", req.body)
    try {
        const wallet = new WalletModel({ balance, name });
        console.log("walet=-------------->", wallet)
        await wallet.save();
        console.log("Wallet initialized successfully");
        return res.status(201).json({
            id: wallet._id,
            balance: wallet.balance,
            name: wallet.name,
            date: wallet.date
        });
    } catch (error) {
        console.error("Error initializing ", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/credit', async (req, res) => {
    const { id, balance ,description} = req.body;
    const adjustedBalance = Number(balance.toFixed(4));
    console.log("adjustable balamce------------>", adjustedBalance)
    try {
        const wallet = await WalletModel.findById(id);
        if (!wallet) {
            console.error('Wallet not found.');
            return res.status(404).json({ error: 'Wallet not found.' });
        }
        if (adjustedBalance < 0) {
            console.error('Invalid requested balance.');
            return res.status(400).json({ error: 'Invalid requested balance.' });
        }
        const updatedWallet = await WalletModel.findByIdAndUpdate(
            id,
            {
                $inc: { balance: +adjustedBalance },
                $set: { type: 'Credit', description: description || 'Recharge' }
            },
        );

        console.log('Balance updated:', updatedWallet);
        const transactionData = new Transaction({
            walletId: id,
            amount: adjustedBalance,
            balance: updatedWallet.balance,
            type: 'Credit',
            description: description || 'Recharge',
        });
        console.log("wallet=-------------->", updatedWallet);
        await transactionData.save();
        return res.status(200).json({
            id: updatedWallet._id,
            balance: updatedWallet.balance,
            name: updatedWallet.name
        });
    } catch (error) {
        console.error("Error updating wallet", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})
// async function creditWallet(id , balances) {
//     try {
//         id = "6581978ac853bc5fb687bb2d"
//         balances = 10;
//         const wallet = await WalletModel.findById(id);
//         if (!wallet) {
//             console.error('Wallet not found.');
//             return;
//         }
//         wallet.balance += balances;
//         wallet.type = "Credit"
//         wallet.description = "Recharge"
//         const creditWallets = await wallet.save();
//         console.log('Balance updated :', creditWallets);
//         return { id: wallet._id, balance: wallet.balance};
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }
