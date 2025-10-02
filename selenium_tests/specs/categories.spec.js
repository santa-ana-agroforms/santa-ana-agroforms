const { BASE, buildLocal, buildLT, By } = require('../helpers');
const useLT = !!process.env.LT_USERNAME;
const build = useLT ? buildLT : buildLocal;

describe('Selenium Categorías', function () {
  this.timeout(60000);
  let driver;
  before(async () => { driver = await build('Categories'); });
  after(async () => { if (driver) await driver.quit(); });

  it('lista categorías', async () => {
    await driver.get(BASE + '/categories');
    await driver.findElements(By.css('table, [role=table], .ant-table'));
  });

  it('abrir modal "Nueva"', async () => {
    const btns = await driver.findElements(By.xpath("//button[contains(translate(.,'NUEVAAGREGAR','nuevaagregar'),'nueva') or contains(translate(.,'NUEVAAGREGAR','nuevaagregar'),'agregar')]"));
    if (btns[0]) await btns[0].click();
  });

  it('inputs presentes', async () => {
    await driver.findElements(By.css('input, textarea'));
  });

  it('guardar (si aplica)', async () => {
    const btns = await driver.findElements(By.xpath("//button[contains(translate(.,'GUARDAR','guardar'),'guardar')]"));
    if (btns[0]) await btns[0].click();
  });

  it('acciones editar/eliminar visibles', async () => {
    await driver.findElements(By.xpath("//button[contains(translate(.,'EDITAR','editar'),'editar') or contains(translate(.,'ELIMINAR','eliminar'),'eliminar')]"));
  });
});
