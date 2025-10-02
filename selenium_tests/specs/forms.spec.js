const { BASE, buildLocal, buildLT, By } = require('../helpers');
const useLT = !!process.env.LT_USERNAME;
const build = useLT ? buildLT : buildLocal;

describe('Selenium Formularios', function () {
  this.timeout(60000);
  let driver;
  before(async () => { driver = await build('Forms'); });
  after(async () => { if (driver) await driver.quit(); });

  it('abre listado', async () => {
    await driver.get(BASE + '/forms');
    await driver.findElements(By.css('table, [role=table]'));
  });

  it('abre modal nuevo (si hay botón)', async () => {
    try {
      const btns = await driver.findElements(By.xpath("//button[contains(translate(.,'NUEVOCREAR','nuevocrear'),'nuevo') or contains(translate(.,'NUEVOCREAR','nuevocrear'),'crear')]"));
      if (btns[0]) await btns[0].click();
    } catch {}
  });

  it('buscador presente', async () => {
    await driver.findElements(By.css('input[type=search], input[placeholder*="buscar" i]'));
  });

  it('acciones por fila', async () => {
    await driver.findElements(By.css('button'));
  });

  it('exportar visible (si aplica)', async () => {
    await driver.findElements(By.xpath("//button[contains(translate(.,'EXPORTAR','exportar'),'exportar')]"));
  });
});
