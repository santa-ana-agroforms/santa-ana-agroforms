if (!process.env.FORCE_LOCAL) {
  require('dotenv').config();
}

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const BASE = process.env.BASE_URL || 'http://localhost:5173';

async function buildLocal() {
  console.log('Configurando Chrome...');
  
  const options = new chrome.Options();
  
  options.addArguments('--no-proxy-server');
  options.addArguments('--proxy-server="direct://"');
  options.addArguments('--proxy-bypass-list=*');
  options.addArguments('--disable-web-security');
  options.addArguments('--disable-features=IsolateOrigins,site-per-process');
  options.addArguments('--disable-blink-features=AutomationControlled');
  
  if (process.env.CI) {
    console.log('Modo CI detectado - ejecutando en headless');
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');
  } else {
    options.addArguments('--start-maximized');
    // Solo en Windows usar user-data-dir específico
    if (process.platform === 'win32') {
      options.addArguments('--user-data-dir=C:\\temp\\selenium-chrome-profile');
    }
  }
  
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  
  console.log('Chrome iniciado');
  return driver;
}

function ltCapabilities(name) {
  return {
    browserName: 'Chrome',
    browserVersion: 'latest',
    'LT:Options': {
      user: process.env.LT_USERNAME,
      accessKey: process.env.LT_ACCESS_KEY,
      build: process.env.LT_BUILD || 'santa-ana-agroforms',
      project: 'santa-ana-agroforms',
      name,
      platformName: 'Windows 11',
      selenium_version: '4.21.0',
      tunnel: true,
      tunnelName: process.env.CI ? 'GHActionsTunnel' : 'SantaAnaTunnel',
    },
  };
}

async function buildLT(name) {
  const caps = ltCapabilities(name);
  return await new Builder()
    .usingServer('https://hub.lambdatest.com/wd/hub')
    .withCapabilities(caps)
    .build();
}

async function doLogin(driver, { user = 'test@test.com', pass = '123456' } = {}) {
  console.log('Iniciando login...');
  
  await driver.get(BASE + '/');
  console.log('Esperando React...');
  
  await driver.sleep(10000); // Más tiempo para LambdaTest
  
  try {
    console.log('Buscando inputs...');
    
    const usernameInput = await driver.wait(
      until.elementLocated(By.xpath("//input[@placeholder='Usuario']")),
      25000
    );
    
    const passwordInput = await driver.wait(
      until.elementLocated(By.xpath("//input[@placeholder='Contraseña']")),
      25000
    );
    
    // Botón por type en vez de texto
    const submitBtn = await driver.wait(
      until.elementLocated(By.css('button[type="submit"]')),
      25000
    );
    
    console.log('Escribiendo credenciales...');
    await usernameInput.sendKeys(user);
    await passwordInput.sendKeys(pass);
    await driver.sleep(1000);
    
    console.log('Click en submit...');
    await submitBtn.click();
    
    console.log('Esperando /home...');
    await driver.wait(until.urlContains('/home'), 25000);
    await driver.wait(until.elementLocated(By.css('.ant-menu')), 25000);
    
    console.log('Login exitoso');
    
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

async function expandAllSubmenus(driver) {
  const titles = await driver.findElements(By.css('.ant-menu-submenu-title'));
  for (const t of titles) {
    try {
      const isOpen = await t.getAttribute('aria-expanded');
      if (isOpen !== 'true') {
        await t.click();
        await driver.sleep(500);
      }
    } catch (_) {}
  }
}

async function clickMenuByText(driver, text) {
  await expandAllSubmenus(driver);
  await driver.sleep(500);
  const el = await driver.findElement(By.xpath(`//span[normalize-space(text())='${text}']`));
  await el.click();
  await driver.sleep(1000);
}

async function clickFirstMenu(driver, labels) {
  await expandAllSubmenus(driver);
  await driver.sleep(1000); // Aumentado de 500ms a 1000ms
  
  for (const txt of labels) {
    const els = await driver.findElements(By.xpath(`//span[normalize-space(text())='${txt}']`));
    if (els.length) {
      try {
        // Esperar a que el elemento sea clickeable
        await driver.wait(until.elementIsVisible(els[0]), 5000);
        await driver.wait(until.elementIsEnabled(els[0]), 5000);
        
        // Scroll al elemento por si está fuera de vista
        await driver.executeScript('arguments[0].scrollIntoView({block: "center"});', els[0]);
        await driver.sleep(500);
        
        // Intentar click normal
        await els[0].click();
        await driver.sleep(1000);
        return;
      } catch (e) {
        // Si falla, intentar con JavaScript click
        console.log(`Click normal falló en "${txt}", intentando JS click...`);
        await driver.executeScript('arguments[0].click();', els[0]);
        await driver.sleep(1000);
        return;
      }
    }
  }
  throw new Error(`No encontré: ${labels.join(', ')}`);
}

module.exports = {
  BASE,
  buildLocal,
  buildLT,
  doLogin,
  clickMenuByText,
  clickFirstMenu,
  expandAllSubmenus,
  By,
  until
};