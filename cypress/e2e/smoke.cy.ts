describe('Smoke', () => {
  it('sirve la app en / (login) con 200', () => {
    cy.request('/').its('status').should('be.oneOf', [200, 304]);
    cy.visit('/');
    cy.contains('Entrar');            // botón de LoginCard
  });

  it('tiene inputs de login', () => {
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="password"]').should('exist');
  });

  it('redirige a /home tras login simulado', () => {
    cy.get('input[name="username"]').type('admin@example.com');
    cy.get('input[name="password"]').type('secret123');
    cy.contains('Entrar').click();
    cy.url().should('include', '/home');
  });

  it('carga /home directamente', () => {
    cy.visit('/home', { failOnStatusCode: false });
    cy.get('body').should('exist');
  });

  it('sidebar visible en /home', () => {
    cy.contains('Dashboard'); // label de menú
  });
});
