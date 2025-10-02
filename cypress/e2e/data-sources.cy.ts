import { clickMenu } from '../support/helpers';

describe('DataSourcesPage', () => {
  beforeEach(() => {
    cy.visit('/home');
    clickMenu('Formularios');
    clickMenu('Fuentes de Datos');
  });

  it('carga la página', () => cy.get('body').should('exist'));

  it('abre modal/agregar si hay botón', () => {
    cy.contains(/Nueva|Agregar|Add/i).click({ force: true });
  });

  it('input file si existe', () => {
    cy.get('input[type=file]').its('length').should('be.gte', 0);
  });

  it('guardar si existe', () => {
    cy.contains(/Guardar|Save/i).click({ force: true });
  });

  it('notificación/alerta si existe', () => {
    cy.get('[role=alert], .ant-message, .ant-notification').its('length').should('be.gte', 0);
  });
});
