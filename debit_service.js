const mongoose = require('mongoose')
const { WalletModel } = require('./wallet_service.js');
const { app } = require('./service.js')
const { Transaction } = require('./transaction.js')





app.post('/debit', async (req, res) => {
    const { id, balance, description } = req.body;
    console.log("request-jhugjhbj->", req.body);
    const adjustedBalance = Number(balance.toFixed(4));
    console.log("adjustedBalance------------->", adjustedBalance)
    try {
        const wallet = await WalletModel.findById(id);
        if (!wallet) {
            console.error('Wallet not found.');
            return res.status(404).json({ error: 'Wallet not found.' });
        }
        if (adjustedBalance <= 0) {
            console.error('Invalid requested balance.');
            return res.status(400).json({ error: 'Invalid requested balance.' });
        }
        if (adjustedBalance > wallet.balance) {
            console.error('Insufficient funds.');
            return res.status(400).json({ error: 'Insufficient funds.' });
        }
        const updatedWallet = await WalletModel.findByIdAndUpdate(
            id,
            {
                $inc: { balance: -adjustedBalance },
                $set: { type: 'debit', description: description || 'Debit was successful' }
            }
        );
        console.log('Balance updated:', updatedWallet);
        const transactionData = new Transaction({
            walletId: id,
            amount: adjustedBalance,
            balance: updatedWallet.balance,
            type: 'Debit',
            description: description || 'Deducted',
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
});

