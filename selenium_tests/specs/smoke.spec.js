const { BASE, buildLocal, buildLT, By, until } = require('../helpers');
const useLT = !!process.env.LT_USERNAME;
const build = useLT ? buildLT : buildLocal;

describe('Selenium Smoke', function () {
  this.timeout(60000);
  let driver;

  before(async () => { driver = await build('Smoke'); });
  after(async () => { if (driver) await driver.quit(); });

  it('carga home', async () => {
    await driver.get(BASE + '/');
    const title = await driver.getTitle();
    await driver.wait(until.elementLocated(By.css('body')), 5000);
  });

  it('carga login', async () => {
    await driver.get(BASE + '/login');
    await driver.wait(until.elementLocated(By.css('input,form,button')), 5000);
  });

  it('existe header', async () => {
    await driver.get(BASE + '/');
    await driver.findElement(By.css('header'));
  });

  it('existe main', async () => {
    await driver.findElement(By.css('main'));
  });

  it('existe footer o nav', async () => {
    const els = await driver.findElements(By.css('footer,nav'));
    if (!els.length) throw new Error('Sin footer/nav');
  });
});
