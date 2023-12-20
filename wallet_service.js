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



module.exports = { WalletModel };  