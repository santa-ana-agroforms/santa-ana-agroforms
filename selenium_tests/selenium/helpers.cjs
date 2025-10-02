require('dotenv').config();
const { Builder, By, until } = require('selenium-webdriver');

const BASE = process.env.BASE_URL || 'http://localhost:5173';

async function buildLocal() {
  return await new Builder().forBrowser('chrome').build();
}

function ltCapabilities(name) {
  return {
    browserName: 'Chrome',
    browserVersion: 'latest',
    'LT:Options': {
      user: process.env.LT_USERNAME,
      accessKey: process.env.LT_ACCESS_KEY,
      build: process.env.LT_BUILD || 'santa-ana-agroforms',
      project: 'santa-ana-frontend',
      name,
      platformName: 'Windows 11',
      selenium_version: '4.0.0',
      console: true,
      network: true,
      visual: true
    }
  };
}

async function doLogin(driver) {
  await driver.get(BASE + '/');
  await driver.wait(until.elementLocated(By.css('input#login_username')), 10000);
  
  const username = await driver.findElement(By.css('input#login_username'));
  const password = await driver.findElement(By.css('input#login_password'));
  const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
  
  await username.sendKeys('admin@test.com'); // Cambia por credenciales válidas
  await password.sendKeys('password123');
  await submitBtn.click();
  
  await driver.wait(until.urlContains('/home'), 10000);
  await driver.wait(until.elementLocated(By.css('.ant-menu')), 10000);
}

module.exports = { BASE, buildLocal, buildLT, doLogin, By, until };

async function buildLT(name) {
  const caps = ltCapabilities(name);
  return await new Builder()
    .usingServer('https://hub.lambdatest.com/wd/hub')
    .withCapabilities(caps)
    .build();
}

module.exports = { BASE, buildLocal, buildLT, By, until };