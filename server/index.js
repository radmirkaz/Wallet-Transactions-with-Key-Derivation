const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const crypto = require('crypto');
const scrypt = require('scrypt-js')
const data = require('../data/data.json');
const { keccak256 } = require("ethereum-cryptography/keccak");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0255e9878ab2269a54c8888f752e2e196c25ddf823c1d76c0921583c75bae1fcf8": 100, // pass: apple
  "031816a4002037a3f98a54afd435077911f2c47bfc984b7a17b2b07abcb98d9e76": 50, // pass: orange
  "0271b06415b559c62b1e8aad999ebc44068ff1b88a258ac4e36f6d8706fa6fbec4": 75, // pass: lemon
};

let lastPasswordVerification = null;
let lastPrivateKey = null;

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  if (!lastPasswordVerification || !lastPasswordVerification.isValid || lastPasswordVerification.address !== sender) {
    res.status(400).send({ message: "Invalid password or no password verification provided for the wallet key." });
    return;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    const msgHash = keccak256(Uint8Array.from(Buffer.from(`Sent ${amount} from ${sender} to ${recipient}`)))
    const signature = secp256k1.sign(msgHash, lastPrivateKey);
    const isSigned = secp256k1.verify(signature, msgHash, sender);

    if (isSigned) {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
      console.log(`Sent ${amount} from ${sender} to ${recipient}`); 
    } else {
      res.status(400).send({ message: "Invalid signature!" });
    }
  }
});

app.post("/verifyPassword", async (req, res) => {
  const { address, password } = req.body;

  const N = 1024, r = 8, p = 1, dkLen = 32;
  const iv = data[address]['iv']
  const encryptedPrivateKey = data[address]['encryptedPrivateKey']

  async function deriveKey() {
      return await scrypt.scrypt(Buffer.from(password), Buffer.from("salt"), N, r, p, dkLen);
  }
  
  async function doSomethingWithKey() {
    let key = await deriveKey();
    // console.log(toHex(key));

    let decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));

    try {
      let decryptedPrivateKey = decipher.update(encryptedPrivateKey, 'hex', 'utf8');
      decryptedPrivateKey += decipher.final('utf8');
      // console.log(decryptedPrivateKey);
      res.send({ isValid: true });

      lastPasswordVerification = { "address":address, "isValid": true };
      lastPrivateKey = decryptedPrivateKey
    } catch (err) {
      res.send({ isValid: false });

      lastPasswordVerification = { "address":address, "isValid": false };
    }
  }

  doSomethingWithKey();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
