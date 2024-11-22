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

const app = express()
const port = process.env.PORT || 3000;

const SLAT = process.env.SALT;
const KEY = process.env.KEY;
const IV = process.env.IV;
const MINBALANCE = process.env.MINBALANCE;
const CLUSTER = process.env.CLUSTER;

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

function findPublicKey() {
}

app.get('/', (req, res) => {
    res.json({ message: "Web3 User Pay Service" })
    return res.end();
})

app.get('/health', (req, res) => {
    res.json({ message: "ok" })
    return res.end();
})

app.post('/getAccount', function (req, res) {
    const address = req.body.address;
    if (!address) {
        res.status(400).json({ error: "parms {address} must be set" })
    } else {
	const publicKey = findPublicKey();
        res.json({ result: publicKey })
    }

    return res.end();
})

app.post('/getBalance', async function (req, res) {
    const address = req.body.address;
    if (!address) {
        res.status(400).json({ error: "parms { address } must be set" })
        return res.end();
    }

    const balance = await getBalance(address)
    res.json({ result: balance })
    return res.end();
})
 
app.post('/getUserToken', async function (req, res) {
    const address = req.body.address;
    if (!address) {
        res.status(400).json({ error: "parms { address } must be set" })
        return res.end();
    }
    ///
    // verify balance
    //
    const balance = await getBalance(address)
    console.log("LAMPORTS:", balance);
    if (balance < MINBALANCE) {
        res.status(403).json({ error: `Account balance must be greater than ${MINBALANCE} LAMPORTS` })
        return res.end();
    }
    //
    // verify signature
    //
    try {
        const publicKey = new web3.PublicKey(address);
        const messageBytes = new TextEncoder().encode(uid)
        const result = tweetnacl.sign.detached.verify(
            messageBytes,
            bs58.default.decode(signature),
            publicKey.toBytes(),
        );
        if(!result) {
            res.status(400).json({ error: "signature not valid!" });
            return res.end();
        }
    } catch (error) {
        console.error('Error in getUserToken[1]:', error.message);
        res.status(500).json({ error: "Internal server error" });
        return res.end();
    }

    //
    // generate token
    //
    const plaintext = address + "," + uid
    try {
        const ciphertext = aesEncrypt(plaintext);
        res.json({ result: ciphertext })
        return res.end();
    } catch (error) {
        console.error('Error in getUserToken[2]:', error.message);
        res.status(500).json({ error: "Internal server error" });
        return res.end();
    }
})

app.post('/checkUserToken', function (req, res) {
    const ciphertext = req.body.token;
    if (!ciphertext) {
        res.status(400).json({ error: "parms {token} must be set" })
        return res.end();
    }

    try {
        const plaintext = aesDecrypt(ciphertext);
        const tmp = plaintext.split(",")

        res.json({
            result: {
                address: tmp[0],
                uid: tmp[1]
            }
        })
        return res.end();
    } catch (error) {
        console.error('Error in checkUserToken:', error.message);
        res.status(500).json({ error: "Internal server error" });
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
