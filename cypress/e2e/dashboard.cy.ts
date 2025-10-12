import { clickMenu } from '../support/helpers';

describe('DashboardPage', () => {
  beforeEach(() => {
    cy.visit('/home');
    clickMenu('Dashboard');
  });

  it('renderiza contenedor', () => {
    cy.contains('Dashboard').should('exist');
  });

  it('muestra las 3 cards de métricas', () => {
    cy.contains('Usuarios Totales').should('exist');
    cy.contains('Usuarios Activos').should('exist');
    cy.contains('% Activos').should('exist');
  });

  it('gráficas renderizan (canvas de @ant-design/charts)', () => {
    cy.get('canvas').should('have.length.at.least', 4);
  });

  it('títulos de gráficas visibles', () => {
    cy.contains('Cantidad de formularios recibidos por fecha').should('exist');
    cy.contains('Respuestas por tipo de formulario').should('exist');
    cy.contains('Cantidad de terminales por usuario').should('exist');
  });

  it('sidebar sigue visible', () => {
    cy.get('.ant-menu').should('exist');
  });
});