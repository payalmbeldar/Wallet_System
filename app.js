const mongoose = require('mongoose')
const { getData, WalletModel } = require('./wallet_service.js');
const { creditWallet } = require('./credit_service.js');
const { debitWallet } = require('./debit_service')
const express = require('express');
const bodyParser = require('body-parser');
const { app } = require('./service.js')
const axios = require('axios');
const path = require('path');
const fs = require('fs');




const mongoURI = 'mongodb://localhost:27017/LocalDatabase';
mongoose.connect(mongoURI);

const db = mongoose.connection;


db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'app.html'));
});

async function createWallet() {
    try {
        const name = document.getElementById('name').value;
        const balance = document.getElementById('balance').value;

        const response = await fetch('http://localhost:4200/setup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, balance }),
        });
        const walletId = await response.json();
        const id = walletId.id
        console.log("walletid------------>", walletId)
        localStorage.setItem('walletId', id)
        console.log('dbgjajhbuyjg', walletId.id)
        console.log("responce------>", response)
    } catch (error) {
        console.error('Error creating wallet:', error.message);
    }
}


function showTransactions() {
    window.location.href = 'transaction.html';
}

async function executeTransaction() {
    console.log("bhgiuab")
    const amount = parseFloat(document.getElementById('amount').value);
    const walletId = localStorage.getItem('walletId');
    const transactionType = document.getElementById('transactionType').value.toLowerCase();

    console.log("transactionType------------->", transactionType)
    console.log("walhbvhsbg-------->", walletId)
    if (transactionType === "credit") {
        this.description = 'Recharge'
    } else {

        this.description = "Money was Debited"
    }

    const response = await fetch(`http://localhost:4200/${transactionType}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: walletId, balance: amount, description: this.description }),
    });
    console.log("responce----------->", response)

}


async function ShowAllTransactions() {
    const walletId = localStorage.getItem('walletId');
    console.log("bjhsbbguhs------------->", walletId)
    const skip = parseFloat(document.getElementById('skip').value);
    const limit = parseFloat(document.getElementById('limit').value);

    const response = await fetch(`http://localhost:4200/transactions?walletId=${walletId}&skip=${skip}&limit=${limit}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (response.ok) {
        const transactions = await response.json();
        displayTransactions(transactions);
    } else {
        console.error("Error fetching transactions:", response.statusText);
    }
}

function displayTransactions(transactions) {
    const transactionsBody = document.getElementById('transactionsBody');

    // Clear existing rows
    transactionsBody.innerHTML = '';

    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.type}</td>
            <td>${transaction.amount}</td>
            <td>${transaction.description}</td>
            <td>${transaction.balance}</td>
        `;
        transactionsBody.appendChild(row);
    });
}

module.exports = { app };




