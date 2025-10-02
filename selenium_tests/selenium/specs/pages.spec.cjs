const { BASE, buildLocal, buildLT, doLogin, By, until } = require('../helpers.cjs');
const useLT = !!process.env.LT_USERNAME;
const build = useLT ? buildLT : buildLocal;

describe('Selenium Pages elementos clave', function () {
  this.timeout(60000);
  let driver;

  before(async () => { 
    driver = await build('Pages');
  });
  
  after(async () => { if (driver) await driver.quit(); });

  it('Login tiene inputs', async () => {
    await driver.get(BASE + '/');
    await driver.wait(until.elementLocated(By.css('input#login_username')), 10000);
    await driver.findElement(By.css('input#login_password'));
  });

  it('puede hacer login', async () => {
    await doLogin(driver);
  });

  it('Home tiene sidebar', async () => {
    await driver.findElement(By.css('.ant-menu'));
  });

  it('Dashboard tiene gráficas', async () => {
    const dashboard = await driver.findElement(By.xpath("//span[contains(text(), 'Dashboard')]"));
    await dashboard.click();
    await driver.sleep(2000);
    const canvases = await driver.findElements(By.css('canvas'));
    if (canvases.length === 0) throw new Error('No hay gráficas');
  });

  it('Formularios tiene tabla', async () => {
    const forms = await driver.findElement(By.xpath("//span[contains(text(), 'Formularios')]"));
    await forms.click();
    await driver.sleep(500);
    const listado = await driver.findElement(By.xpath("//span[contains(text(), 'Listado')]"));
    await listado.click();
    await driver.sleep(2000);
    await driver.findElement(By.css('table, .ant-table'));
  });
});