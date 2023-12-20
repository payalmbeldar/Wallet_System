const mongoose = require('mongoose')
const { app } = require('./service.js')


const WalletSchema = new mongoose.Schema({
    name: String,
    amount : Number,
    balance: Number,
    date: { type: Date, default: Date.now },
    description : String,
    type : String,
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],

})



const WalletModel = mongoose.model('Wallet', WalletSchema);

app.get('/getData', async (req, res) => {
    const { id } = req.body;
    console.log("request-->", req.body)
    try {
        const response = await WalletModel.findById(id);
        console.log("response----------------->", response);

        if (!response) {
            console.error('Wallet not found.');
            return res.status(404).json({ error: 'Wallet not found.' });
        }

        return res.status(201).json({
            id: response._id,
            balance: response.balance,
            name: response.name,
            date: response.date
        });
    } catch (error) {
        console.error("Error fetching data", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = { WalletModel };  