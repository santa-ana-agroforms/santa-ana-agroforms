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

async function buildLT(name) {
  const caps = ltCapabilities(name);
  return await new Builder()
    .usingServer('https://hub.lambdatest.com/wd/hub')
    .withCapabilities(caps)
    .build();
}

module.exports = { BASE, buildLocal, buildLT, By, until };