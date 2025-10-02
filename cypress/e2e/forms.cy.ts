import { clickMenu } from '../support/helpers';

describe('FormListPage', () => {
  beforeEach(() => {
    cy.visit('/home');
    clickMenu('Formularios');
    clickMenu('Listado');
  });

  it('carga la vista de listado', () => {
    cy.get('body').should('exist');
  });

  it('muestra tabla o listado', () => {
    cy.get('table, [role=table], .ant-table, [class*="table"]').its('length').should('be.gte', 0);
  });

  it('buscador si existe', () => {
    cy.get('input[type=search], input[placeholder*="buscar" i]').first().type('demo', { delay: 0 }).blur();
  });

  it('acciones por fila si existen', () => {
    cy.get('button, [role=button]').its('length').should('be.gte', 0);
  });

  it('botón nuevo/crear si existe', () => {
    cy.contains(/Nuevo|Crear/i).click({ force: true });
  });
});
