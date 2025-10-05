const { buildLocal, buildLT, doLogin, clickMenuByText, clickFirstMenu, By } = require('../helpers.cjs');
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
    const els = await driver.findElements(By.xpath("//span[normalize-space(text())='Dashboard']"));
    if (!els.length) throw new Error('No encontré Dashboard en el menú');
  });

  it('puede hacer click en Dashboard', async () => {
    await clickMenuByText(driver, 'Dashboard');
  });

  it('abre Formularios → Listado', async () => {
    await clickMenuByText(driver, 'Formularios');
    await clickMenuByText(driver, 'Listado');
  });

  it('abre Sesión → Terminales (o Dispositivos/Devices)', async () => {
    await clickMenuByText(driver, 'Sesión');
    await clickFirstMenu(driver, ['Terminales', 'Dispositivos', 'Devices']);
  });

  it('abre Sesión → Usuarios/Users', async () => {
    await clickMenuByText(driver, 'Sesión');
    await clickFirstMenu(driver, ['Usuarios', 'Users']);
  });

  it('abre Formularios → Fuentes de Datos', async () => {
    await clickMenuByText(driver, 'Formularios');
    await clickMenuByText(driver, 'Fuentes de Datos');
  });
});
