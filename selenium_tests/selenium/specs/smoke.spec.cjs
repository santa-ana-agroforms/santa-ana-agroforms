const { BASE, buildLocal, buildLT, doLogin, By, until } = require('../helpers.cjs');
const useLT = !!process.env.LT_USERNAME;
const build = useLT ? buildLT : buildLocal;

describe('Selenium Smoke', function () {
  this.timeout(60000);
  let driver;

  before(async () => { driver = await build('Smoke'); });
  after(async () => { if (driver) await driver.quit(); });

  it('carga home (login)', async () => {
    await driver.get(BASE + '/');
    await driver.wait(until.elementLocated(By.css('body')), 10000);
    const title = await driver.getTitle();
    console.log('Title:', title);
  });

  it('tiene botón Entrar', async () => {
    await driver.get(BASE + '/');
    await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 10000);
    const btn = await driver.findElement(By.css('button[type="submit"]'));
    const text = await btn.getText();
    if (!text.includes('Entrar')) throw new Error('Botón Entrar no encontrado');
  });

  it('tiene logo', async () => {
    const logos = await driver.findElements(By.css('img'));
    if (logos.length === 0) throw new Error('No hay imágenes/logo');
  });

  it('puede hacer login y carga /home', async () => {
    await doLogin(driver);
    const url = await driver.getCurrentUrl();
    if (!url.includes('/home')) throw new Error('No redirigió a /home');
  });

  it('sidebar visible en /home', async () => {
    await driver.findElement(By.css('.ant-menu'));
  });
});