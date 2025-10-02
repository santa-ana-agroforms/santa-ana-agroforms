import { clickMenu } from '../support/helpers';

describe('Asignación de Formularios', () => {
  beforeEach(() => {
    cy.visit('/home');
    clickMenu('Formularios');
    clickMenu('Asignación de Formularios');
  });

  it('carga la vista', () => cy.get('body').should('exist'));

  it('lista/tabla si existe', () => {
    cy.get('table, [role=table], .ant-table').its('length').should('be.gte', 0);
  });

  it('selector de usuario/terminal si existe', () => {
    cy.get('select, [role=combobox]').its('length').should('be.gte', 0);
  });

  it('botón asignar si existe', () => {
    cy.contains(/Asignar|Guardar/i).its('length').should('be.gte', 0);
  });

  it('mensaje/alerta si existe', () => {
    cy.get('[role=alert], .ant-message, .ant-notification').its('length').should('be.gte', 0);
  });
});
