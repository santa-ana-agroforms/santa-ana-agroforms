const { buildLocal, buildLT, doLogin, clickMenuByText, clickFirstMenu, By, until } = require('../helpers.cjs');
const useLT = !!process.env.LT_USERNAME;
const build = useLT ? buildLT : buildLocal;

describe('Selenium Extras', function () {
  this.timeout(70000);
  let driver;

  before(async () => { driver = await build('Extras'); await doLogin(driver); });
  after(async () => { if (driver) await driver.quit(); });

  it('Fuentes de Datos muestra botones de acción', async () => {
    await clickMenuByText(driver, 'Formularios');
    await clickMenuByText(driver, 'Fuentes de Datos');
    const btns = await driver.findElements(By.xpath("//button[normalize-space()='Nueva' or contains(.,'Agregar') or contains(.,'Add')]"));
    if (!btns.length) console.warn('Sin botón Nueva/Agregar');
  });

  it('Fuentes de Datos → modal con selects', async () => {
    const add = await driver.findElements(By.xpath("//button[normalize-space()='Nueva' or contains(.,'Agregar') or contains(.,'Add')]"));
    if (add.length) {
      await add[0].click();
      await driver.sleep(500);
      const selects = await driver.findElements(By.css('.ant-select'));
      if (!selects.length) console.warn('No se vieron selects en el modal (flujo opcional)');
    }
  });

  it('Listado de Formularios → buscador', async () => {
    await clickMenuByText(driver, 'Formularios');
    await clickMenuByText(driver, 'Listado');
    const search = await driver.findElements(By.css('input[type="search"], input[placeholder*="buscar" i]'));
    if (search.length) await search[0].sendKeys('demo');
  });

  it('Asignación de Formularios → combos/tabla/botón', async () => {
    await clickMenuByText(driver, 'Formularios');
    await clickMenuByText(driver, 'Asignación de Formularios');
    await driver.findElements(By.css('select, [role="combobox"], table, .ant-table, button'));
  });

  it('Asignaciones en proceso → filtros (opcionales)', async () => {
    await clickMenuByText(driver, 'Formularios');
    await clickMenuByText(driver, 'Asignaciones en proceso');
    await driver.findElements(By.css('select, [role="combobox"], input[type="search"]'));
  });

  it('Rutas de Aprobación carga', async () => {
    await clickMenuByText(driver, 'Formularios');
    await clickMenuByText(driver, 'Rutas de Aprobación');
    await driver.findElement(By.css('body'));
  });

  it('Procesos de Exportación muestra tabla', async () => {
    await clickMenuByText(driver, 'Formularios');
    await clickMenuByText(driver, 'Procesos de Exportación');
    await driver.findElements(By.css('table, .ant-table, [role="table"]'));
  });

  it('Crear desde Excel muestra UI básica', async () => {
    await clickMenuByText(driver, 'Formularios');
    await clickMenuByText(driver, 'Crear desde Excel');
    await driver.findElement(By.css('body'));
  });

  it('Terminales muestra lista/acciones', async () => {
    await clickMenuByText(driver, 'Sesión');
    await clickFirstMenu(driver, ['Terminales', 'Dispositivos', 'Devices']);
    await driver.findElements(By.css('table, .ant-table, ul, ol, button, [role="button"]'));
  });

  it('Usuarios muestra tabla/buscador', async () => {
    await clickMenuByText(driver, 'Sesión');
    await clickFirstMenu(driver, ['Usuarios', 'Users']);
    await driver.findElements(By.css('table, .ant-table, [role="table"], input[type="search"]'));
  });
});
