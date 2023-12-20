const mongoose = require('mongoose')
const express = require('express');
const bodyParser = require('body-parser');
const {  WalletModel } = require('./wallet_service.js'); 
const axios = require('axios');  // Add this line to import Axios

const app = express();
app.use(bodyParser.json());


app.listen(4200, () => {
    console.log(`Server is running on port 4200`);
});

module.exports = { app };