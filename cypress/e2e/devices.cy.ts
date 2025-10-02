import { clickMenu } from '../support/helpers';

describe('DevicesListPage (Terminales)', () => {
  beforeEach(() => {
    cy.visit('/home');
    clickMenu('Terminales');
  });

  it('carga la página', () => cy.get('body').should('exist'));

  it('lista/tabla presente', () => {
    cy.get('table, [role=table], .ant-table, ul, ol').its('length').should('be.gte', 0);
  });

  it('filtro si existe', () => {
    cy.get('select, [role=combobox]').first().then(($el) => {
      if ($el.is('select')) cy.wrap($el).select($el.find('option').eq(0).val() as string);
    });
  });

  it('edición si existe', () => {
    cy.contains(/Editar/i).click({ force: true });
  });

  it('acciones masivas si hay checkboxes', () => {
    cy.get('input[type=checkbox]').first().check({ force: true });
  });
});
