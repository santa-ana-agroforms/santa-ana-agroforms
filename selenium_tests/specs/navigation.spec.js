const { BASE, buildLocal, buildLT, By, until } = require('../helpers');
const useLT = !!process.env.LT_USERNAME;
const build = useLT ? buildLT : buildLocal;

describe('Selenium Navegación', function () {
  this.timeout(60000);
  let driver;
  before(async () => { driver = await build('Nav'); });
  after(async () => { if (driver) await driver.quit(); });

  it('ir a Dashboard', async () => {
    await driver.get(BASE + '/dashboard');
    await driver.wait(until.elementLocated(By.css('body')), 5000);
  });

  it('ir a Formularios', async () => {
    await driver.get(BASE + '/forms');
    await driver.wait(until.elementLocated(By.css('body')), 5000);
  });

  it('ir a Usuarios', async () => {
    await driver.get(BASE + '/users');
    await driver.wait(until.elementLocated(By.css('body')), 5000);
  });

  it('ir a Dispositivos', async () => {
    await driver.get(BASE + '/devices');
    await driver.wait(until.elementLocated(By.css('body')), 5000);
  });

  it('ir a Categorías', async () => {
    await driver.get(BASE + '/categories');
    await driver.wait(until.elementLocated(By.css('body')), 5000);
  });
});
