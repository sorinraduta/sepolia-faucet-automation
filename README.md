# Alchemy Sepolia Faucet Automation

A Node.js script to automate requesting ETH from the Alchemy Sepolia faucet using Puppeteer and 2captcha.

## Prerequisites

- Node.js installed
- An Alchemy account
- A wallet address to receive the test ETH
- A 2captcha API key for solving reCAPTCHA

## Setup

1. Clone the repository

1. Install dependencies:

```bash
npm install
```

1. Create a `.env` file in the root directory with the following variables:

```env
ALCHEMY_EMAIL=your_alchemy_email
ALCHEMY_PASSWORD=your_alchemy_password
TWO_CAPTCHA_API_KEY=your_2captcha_api_key
WALLET_ADDRESS=your_ethereum_wallet_address
```

## Usage

Run the script:

```bash
npm start
```

The script will:

1. Launch a browser window
2. Log in to your Alchemy account
3. Navigate to the Sepolia faucet
4. Input your wallet address
5. Solve the reCAPTCHA
6. Submit the faucet request

## Dependencies

- puppeteer
- puppeteer-extra
- puppeteer-extra-plugin-recaptcha
- dotenv

## Notes

- The browser runs in non-headless mode for visibility
- Make sure all environment variables are properly set before running
