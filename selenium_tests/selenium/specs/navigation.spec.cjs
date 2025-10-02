const { BASE, buildLocal, buildLT, doLogin, By, until } = require('../helpers.cjs');
const useLT = !!process.env.LT_USERNAME;
const build = useLT ? buildLT : buildLocal;

describe('Selenium Navegación', function () {
  this.timeout(60000);
  let driver;

  before(async () => { 
    driver = await build('Nav');
    await doLogin(driver);
  });
  
  after(async () => { if (driver) await driver.quit(); });

  it('menú Dashboard existe', async () => {
    await driver.findElement(By.xpath("//span[contains(text(), 'Dashboard')]"));
  });

  it('submenú Formularios existe', async () => {
    await driver.findElement(By.xpath("//span[contains(text(), 'Formularios')]"));
  });

  it('submenú Sesión existe', async () => {
    await driver.findElement(By.xpath("//span[contains(text(), 'Sesión')]"));
  });

  it('puede hacer click en Dashboard', async () => {
    const el = await driver.findElement(By.xpath("//span[contains(text(), 'Dashboard')]"));
    await el.click();
    await driver.sleep(1000);
  });

  it('puede abrir submenú Formularios', async () => {
    const el = await driver.findElement(By.xpath("//span[contains(text(), 'Formularios')]"));
    await el.click();
    await driver.sleep(500);
    await driver.findElement(By.xpath("//span[contains(text(), 'Listado')]"));
  });
});