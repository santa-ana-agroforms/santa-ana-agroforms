const { BASE, buildLocal, buildLT, By } = require('../helpers');
const useLT = !!process.env.LT_USERNAME;
const build = useLT ? buildLT : buildLocal;

describe('Selenium Pages elementos clave', function () {
  this.timeout(60000);
  let driver;
  before(async () => { driver = await build('Pages'); });
  after(async () => { if (driver) await driver.quit(); });

  it('Login tiene inputs', async () => {
    await driver.get(BASE + '/login');
    await driver.findElement(By.css('input'));
    await driver.findElement(By.css('button'));
  });

  it('Dashboard tiene tarjetas o gráficos', async () => {
    await driver.get(BASE + '/dashboard');
    await driver.findElements(By.css('.card, canvas, svg'));
  });

  it('Users tiene tabla o lista', async () => {
    await driver.get(BASE + '/users');
    await driver.findElements(By.css('table, [role=table], .ant-table'));
  });

  it('Devices tiene acciones', async () => {
    await driver.get(BASE + '/devices');
    await driver.findElements(By.css('button, [role=button]'));
  });

  it('Categories tiene formulario', async () => {
    await driver.get(BASE + '/categories');
    await driver.findElements(By.css('form, [role=form]'));
  });
});
