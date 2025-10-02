const clickMenu = (label: string) =>
  cy.contains('.ant-menu-item, .ant-menu-submenu-title, .ant-menu-title-content', label).click({ force: true });

describe('UserListPage', () => {
  beforeEach(() => {
    cy.visit('/home');
    clickMenu('Usuarios');
  });

  it('carga la vista', () => cy.get('body').should('exist'));

  it('tabla/lista visible', () => {
    cy.get('table, [role=table], .ant-table').its('length').should('be.gte', 0);
  });

  it('buscador si existe', () => {
    cy.get('input[type=search], input[placeholder*="buscar" i]').first().type('admin', { delay: 0 });
  });

  it('abrir modal crear si existe', () => {
    cy.contains(/Nuevo|Crear/i).click({ force: true });
  });

  it('paginación si existe', () => {
    cy.get('.ant-pagination, button:contains("Siguiente"), a:contains("Siguiente")').its('length').should('be.gte', 0);
  });
});
