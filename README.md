# Decentralized Wallet App

This project is a decentralized wallet app that is built on React.js for the frontend and Node.js for the backend. The application allows users to manage their cryptocurrency transactions in a secure manner.

**Demo**: https://drive.google.com/file/d/1zdxneAmvcYiiksuH694Le5Iq_tNGo5qD/view?usp=drive_link

## Features

- Decentralized transaction signing: This feature allows users to sign transactions on the client-side, which means the user's private keys never leave their device. (this is how it should be if we do it at the production level, so only the algorithm works)
- Password verification: The application provides a mechanism to verify the user's password. This password is used to encrypt the user's private key in a secure manner.
- Balance checking: The application allows users to check their account balance.
- Signatures and verification: Every transaction is provided with verified signature

## Installation

To install the necessary dependencies for this project, navigate to the project directory and run:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://127.0.0.1:5173/

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the depedencies 
3. Run `node index` to start the server 

## Security

The application uses state-of-the-art cryptographic libraries to secure the users' private keys and transactions. Passwords are hashed using Scrypt and private keys are encrypted using AES-256-CBC.


Due to the fact that this is an educational project, it does not have the ability to add wallets, and all addresses are already configured.
