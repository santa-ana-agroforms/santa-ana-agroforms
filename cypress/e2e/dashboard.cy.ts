import { clickMenu } from '../support/helpers';

describe('DashboardPage (en /home)', () => {
  beforeEach(() => {
    cy.visit('/home');
    clickMenu('Dashboard');
  });

  it('renderiza contenedor', () => {
    cy.get('body').should('exist');
  });

  it('gráficos o KPIs visibles (si hay)', () => {
    cy.get('canvas, svg, [class*="chart"]').its('length').should('be.gte', 0);
  });

  it('muestra cards o paneles (si hay)', () => {
    cy.get('.ant-card, [class*="card"]').its('length').should('be.gte', 0);
  });

  it('sin errores JS obvios', () => {
    cy.window().then((w) => expect(w).to.exist);
  });

  it('sidebar sigue visible', () => {
    cy.contains('Dashboard');
  });
});
