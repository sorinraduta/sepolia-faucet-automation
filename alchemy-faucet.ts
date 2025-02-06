import dotenv from "dotenv";
import { Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";

dotenv.config();

const ALCHEMY_EMAIL = process.env.ALCHEMY_EMAIL as string;
const ALCHEMY_PASSWORD = process.env.ALCHEMY_PASSWORD as string;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS as string;
const TWO_CAPTCHA_API_KEY = process.env.TWO_CAPTCHA_API_KEY as string;

if (!ALCHEMY_EMAIL || !ALCHEMY_PASSWORD || !WALLET_ADDRESS) {
  console.error("Missing environment variables. Check your .env file.");
  process.exit(1);
}

const LOGIN_URL =
  "https://auth.alchemy.com/?redirectUrl=https%3A%2F%2Fdashboard.alchemy.com%2Fsignup%3Fa%3Deth-sepolia-faucet%26redirectUrl%3Dhttps%253A%252F%252Fwww.alchemy.com%252Ffaucets%252Fethereum-sepolia%253FauthRefresh%253DTrue%26redirect_attempt%3D1";

puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: "2captcha",
      token: TWO_CAPTCHA_API_KEY,
    },
    visualFeedback: true,
  })
);

async function login(page: Page): Promise<void> {
  await page.goto(LOGIN_URL);

  // Enter email
  await page.waitForSelector('[placeholder="gavin@hooli.com"]');
  await page.type('[placeholder="gavin@hooli.com"]', ALCHEMY_EMAIL);

  // Enter password
  await page.waitForSelector('[placeholder="••••••••"]');
  await page.type('[placeholder="••••••••"]', ALCHEMY_PASSWORD);

  // Click on <button> "Log in"
  await page.waitForSelector(".css-anubtc");
  await page.click(".css-anubtc");

  // Wait for redirection
  await page.waitForNavigation({ waitUntil: "networkidle2" });
}

async function requestFaucet(page: Page): Promise<void> {
  // Enter wallet address
  await page.waitForSelector(
    'input[placeholder="Enter Your Wallet Address (0x...) or ETH Mainnet ENS Domain"]'
  );
  await page.type(
    'input[placeholder="Enter Your Wallet Address (0x...) or ETH Mainnet ENS Domain"]',
    WALLET_ADDRESS
  );

  // Solve reCAPTCHA
  await page.solveRecaptchas();

  // Click "Send Funds"
  await page.waitForSelector(".alchemy-faucet-button");
  await page.click(".alchemy-faucet-button");

  console.log("Faucet request sent!");
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await login(page);
    await requestFaucet(page);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
})();
