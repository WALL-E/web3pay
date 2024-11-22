#!/usr/bin/env node

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

//
// Ref: https://nodejs.org/api/crypto.html
//

require('dotenv').config();
const express = require('express')
const crypto = require('crypto')

const web3 = require("@solana/web3.js");
const tweetnacl = require("tweetnacl");
const bs58 = __importDefault(require("bs58"));
const axios = require('axios');


const app = express()
const port = process.env.PORT || 3000;

const SLAT = process.env.SALT;
const KEY = process.env.KEY;
const IV = process.env.IV;
const MINBALANCE = process.env.MINBALANCE;
const CLUSTER = process.env.CLUSTER;
const SQLITEDB = process.env.SQLITEDB;
const RECIPIENT = process.env.RECIPIENT;
const FEES = process.env.FEES;
const COMMISSION = process.env.COMMISSION;

app.use(express.json());

function sha256(content) {
  return crypto.createHash('sha256').update(content).digest('hex')
}

function aesEncrypt(plaintext) {
    const cipher = crypto.createCipheriv('aes-256-cbc', KEY, IV);
    var crypted = cipher.update(plaintext, 'utf8', 'hex');
    crypted += cipher.final('hex');

    return crypted;
}

function aesDecrypt(ciphertext) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', KEY, IV);
    var decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

async function getBalance(address) {
    const connection = new web3.Connection(CLUSTER, 'confirmed');
    const wallet = new web3.PublicKey(address);
    const balance = await connection.getBalance(wallet);

    return balance;
}

async function withdraw(wallet) {
    const plaintext = aesDecrypt(wallet.secretKey)
    const secretKey = plaintext.split(',').map(num => parseInt(num));
    const keypair = web3.Keypair.fromSecretKey(Uint8Array.from(secretKey))

    const connection = new web3.Connection(CLUSTER, 'confirmed');
    const fromPubkey = keypair.publicKey;
    const toPubkey = new web3.PublicKey(wallet.owner);

    const balance = await connection.getBalance(fromPubkey);
    if (balance <= FEES) {
        throw new Error('Insufficient balance to cover transaction costs');
    }

    const transferAmount = balance - FEES;
    const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports: transferAmount
        })
    );

    const signature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair]
    );

    return signature;
}

async function pay(wallet, to, amount) {
    if (amount < FEES) {
        throw new Error(`Transfer amount must be greater than ${FEES} Lamport`);
    }

    const plaintext = aesDecrypt(wallet.secretKey)
    const secretKey = plaintext.split(',').map(num => parseInt(num));
    const keypair = web3.Keypair.fromSecretKey(Uint8Array.from(secretKey))

    const connection = new web3.Connection(CLUSTER, 'confirmed');
    const fromPubkey = keypair.publicKey;
    const toPubkey = new web3.PublicKey(to);
    console.log("XXX 1", toPubkey);
    const recipientPubkey = new web3.PublicKey(RECIPIENT);
    console.log("XXX 2", recipientPubkey);

    const balance = await connection.getBalance(fromPubkey);
    if (balance < (FEES + amount)) {
        throw new Error('Insufficient balance to cover transaction costs');
    }

    const transaction = new web3.Transaction()
    transaction.add(
        web3.SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports: amount*(1-COMMISSION)
        })
    );
    transaction.add(
        web3.SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports: amount*COMMISSION
        })
    );

    const signature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair]
    );

    return signature;
}



async function findPublicKey(address) {
    try {
        const getResponse = await axios.get('http://127.0.0.1:5000/wallet' + `?owner=${address}`);
        return getResponse.data.publicKey;
    } catch (error) {
	console.log("[error] get wallet failed");
    }

    try {
	const keypair = web3.Keypair.generate();
	const publicKey = keypair.publicKey.toBase58();
	const secretKey = keypair.secretKey.toString()
	const ciphertext = aesEncrypt(secretKey);
        const postResponse = await axios.post('http://127.0.0.1:5000/wallet', {
            owner: address,
	    publicKey: publicKey,
	    secretKey: ciphertext
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return publicKey;
    } catch (error) {
	console.log("[error] post wallet failed");
	return null;
    }
}

app.get('/', (req, res) => {
    res.json({ message: "Web3 User Pay Service" })
    return res.end();
})

app.get('/health', (req, res) => {
    res.json({ message: "ok" })
    return res.end();
})

app.post('/getAccount', async function (req, res) {
    const address = req.body.address;
    if (!address) {
        res.status(400).json({ error: "parms {address} must be set" })
    } else {
	const publicKey = await findPublicKey(address);
	if (publicKey === null) {
            res.status(500).json({ error: "something broke!" })
	} else {
            res.json({ result: publicKey })
        }
    }

    return res.end();
})

app.post('/getBalance', async function (req, res) {
    const address = req.body.address;
    if (!address) {
        res.status(400).json({ error: "parms { address } must be set" })
        return res.end();
    }

    try {
        const getResponse = await axios.get('http://127.0.0.1:5000/wallet' + `?owner=${address}`);
        const publicKey =  getResponse.data.publicKey;
        const balance = await getBalance(publicKey)
        res.json({ result: balance })
        return res.end();
    } catch (error) {
	console.log("[error] get wallet failed");
        res.status(500).json({ error: "something broke!" })
        return res.end();
    }
})

app.post('/withdraw', async function (req, res) {
    const address = req.body.address;
    if (!address) {
        res.status(400).json({ error: "parms { address } must be set" })
        return res.end();
    }

    try {
        const getResponse = await axios.get('http://127.0.0.1:5000/wallet' + `?owner=${address}`);
        const wallet =  getResponse.data;
	const signature = await withdraw(wallet)
        res.json({ result: signature})
        return res.end();
    } catch (error) {
	console.log("[/withdraw] failed:", error);
        res.status(500).json({ error: error.message })
        return res.end();
    }
})
 
app.post('/pay', async function (req, res) {
    const from = req.body.from;
    const to = req.body.to;
    const amount = req.body.amount;
    if (!from || !to || !amount) {
        res.status(400).json({ error: "parms { from | to | amount } must be set" })
        return res.end();
    }

    try {
        const getResponse = await axios.get('http://127.0.0.1:5000/wallet' + `?owner=${from}`);
        const wallet = getResponse.data;
	const signature = await pay(wallet, to, amount)
        res.json({ result: signature})
        return res.end();
    } catch (error) {
	console.log("[/pay] failed:", error);
        res.status(500).json({ error: error.message })
        return res.end();
    }
})
 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: "something broke!" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
