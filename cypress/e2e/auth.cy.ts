describe('Auth (LoginPage → HomePage)', () => {
  beforeEach(() => cy.visit('/', { failOnStatusCode: false }));

  it('muestra formulario y logo', () => {
    cy.contains('Entrar');
    cy.get('input[name="username"]');
    cy.get('input[name="password"]');
    cy.get('img'); // logo
  });

  it('permite escribir credenciales', () => {
    cy.get('input[name="username"]').type('test@example.com');
    cy.get('input[name="password"]').type('secret123');
  });

  it('envía y navega a /home', () => {
    cy.contains('Entrar').click();
    cy.url().should('include', '/home');
  });

  it('link “¿Olvidaste tu contraseña?” existe', () => {
    cy.contains('¿Olvidaste tu contraseña?').should('have.attr', 'href', '/reset-password');
  });

  it('si vuelve a /, puede loguear de nuevo', () => {
    cy.visit('/');
    cy.contains('Entrar').should('exist');
  });
});
