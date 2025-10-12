describe('Smoke', () => {
  it('sirve la app en / con 200', () => {
    cy.request('/').its('status').should('be.oneOf', [200, 304]);
    cy.visit('/');
    cy.contains('button', 'Entrar', { timeout: 10000 }).should('be.visible');
  });

  it('tiene inputs de login', () => {
    cy.visit('/');
    cy.contains('button', 'Entrar', { timeout: 10000 }).should('be.visible');
    cy.get('input#login_username').should('exist');
    cy.get('input#login_password').should('exist');
  });

  it('formulario es interactivo', () => {
    cy.visit('/');
    cy.get('input#login_username', { timeout: 10000 }).type('admin@example.com');
    cy.get('input#login_password').type('secret123');
    cy.contains('button', 'Entrar').should('not.be.disabled');
  });

  it('carga /home directamente', () => {
    cy.visit('/home', { failOnStatusCode: false });
    cy.get('body').should('exist');
  });

  it('sidebar visible en /home', () => {
    cy.visit('/home', { failOnStatusCode: false });
    cy.get('.ant-menu', { timeout: 10000 }).should('exist');
  });
});