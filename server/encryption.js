const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const crypto = require('crypto');
const scrypt = require('scrypt-js')
const fs = require('fs');

// const priv = secp256k1.utils.randomPrivateKey();   
const priv = secp256k1.utils.randomPrivateKey();  
const pub = secp256k1.getPublicKey(priv);

console.log(toHex(pub), toHex(priv));

let password = "orange";
let salt = "salt";

// N: CPU/memory cost factor, r: block size, p: parallelization factor, dkLen: derived key length
let N = 1024, r = 8, p = 1, dkLen = 32;

async function deriveKey() {
    let key = await scrypt.scrypt(Buffer.from(password), Buffer.from(salt), N, r, p, dkLen);
    return key;
}

async function doSomethingWithKey() {
    let key = await deriveKey();
    console.log(toHex(key));

    // Create an initialization vector
    let iv = crypto.randomBytes(16);

    let cipher = crypto.createCipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));

    let encryptedPrivateKey = cipher.update(toHex(priv), 'utf8', 'hex');
    encryptedPrivateKey += cipher.final('hex');

    console.log(encryptedPrivateKey);

    let decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));

    let decryptedPrivateKey = decipher.update(encryptedPrivateKey, 'hex', 'utf8');
    decryptedPrivateKey += decipher.final('utf8');

    console.log(decryptedPrivateKey);

    const info2save = {
        "iv": iv,
        "encryptedPrivateKey": encryptedPrivateKey,
        "pubKey": toHex(pub)
    };

    fs.writeFileSync("../data/"+toHex(pub).slice(-20)+".json", JSON.stringify(info2save));

}

doSomethingWithKey();

