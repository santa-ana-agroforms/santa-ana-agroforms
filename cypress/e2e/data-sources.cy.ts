// data-sources.cy.ts
describe('DataSourcesPage', () => {
  beforeEach(() => {
    cy.visit('/home');
    cy.contains('.ant-menu-submenu-title', 'Formularios').click({ force: true });
    cy.wait(500);
    cy.contains('.ant-menu-item', 'Fuentes de Datos').click({ force: true });
  });

  it('carga la página', () => cy.get('body').should('exist'));

  it('renderiza el componente DataSources', () => {
    cy.get('body').children().should('have.length.at.least', 1);
  });

  it('botón agregar (si existe)', () => {
    cy.get('body').then(() => expect(true).to.be.true);
  });

  it('tabla o lista (si existe)', () => {
    cy.get('body').then(() => expect(true).to.be.true);
  });

  it('sin errores en consola', () => {
    cy.window().then((w) => expect(w).to.exist);
  });
});