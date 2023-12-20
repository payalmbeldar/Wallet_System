
const mongoose = require('mongoose')
const { app } = require('./service.js')



const Transaction = mongoose.model('Transaction', {
    walletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
    amount: Number,
    description: String,
    date: { type: Date, default: Date.now },
    type: String, // 'CREDIT' or 'DEBIT'
    balance : Number
});

//limit and skip
app.get('/transactions', async (req, res) => {
    const { walletId, skip, limit } = req.query;
    console.log("wallletid-------->", req.query)
    try {
        const response = await Transaction.find({ walletId })
            .sort({ date: 'desc' })
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        if (!response || response.length === 0) {
            console.error('Transactions not found.');
            return res.status(404).json({ error: 'Transactions not found.' });
        }
        return res.status(200).json(response.map(transaction => ({
            _id: transaction._id,
            walletId: transaction.walletId, 
            amount: transaction.amount,
            balance: transaction.balance,
            description: transaction.description,
            date: transaction.date,
            type: transaction.type,
        })));
    } catch (error) {
        console.error("Error fetching data", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = { Transaction }