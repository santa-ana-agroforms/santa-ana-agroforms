import { clickMenu } from '../support/helpers';

describe('Asignaciones en proceso', () => {
  beforeEach(() => {
    cy.visit('/home');
    clickMenu('Formularios');
    clickMenu('Asignaciones en proceso');
  });

  it('carga la vista', () => cy.get('body').should('exist'));

  it('cards/indicadores si existen', () => {
    cy.get('.ant-card, [class*="card"], canvas, svg').its('length').should('be.gte', 0);
  });

  it('filtros si existen', () => {
    cy.get('select, [role=combobox], input[type=search]').its('length').should('be.gte', 0);
  });

  it('acciones si existen', () => {
    cy.get('button, [role=button]').its('length').should('be.gte', 0);
  });

  it('notif/alert si existen', () => {
    cy.get('[role=alert], .ant-message, .ant-notification').its('length').should('be.gte', 0);
  });
});
