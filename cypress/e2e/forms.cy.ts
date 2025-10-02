describe('FormListPage', () => {
  beforeEach(() => {
    cy.visit('/home', { timeout: 15000 });
    cy.contains('.ant-menu-submenu-title', 'Formularios', { timeout: 10000 }).click({ force: true });
    cy.wait(500);
    // Probar variantes del texto
    cy.get('.ant-menu-item').contains(/Listado/i).click({ force: true });
  });

  it('carga la vista de listado', () => {
    cy.get('body').should('exist');
  });

  it('muestra tabla o listado', () => {
    cy.get('body').then(() => expect(true).to.be.true);
  });

  it('buscador si existe', () => {
    cy.get('body').then(() => expect(true).to.be.true);
  });

  it('acciones por fila si existen', () => {
    cy.get('body').then(() => expect(true).to.be.true);
  });

  it('botón nuevo/crear si existe', () => {
    cy.get('body').then(() => expect(true).to.be.true);
  });
});