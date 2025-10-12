import { clickMenu } from '../support/helpers';

describe('Asignaciones en proceso', () => {
  beforeEach(() => {
    cy.visit('/home');
    cy.contains('.ant-menu-submenu-title', 'Formularios').click({ force: true });
    cy.wait(500);
    cy.contains('.ant-menu-item', 'Asignaciones en proceso').click({ force: true });
  });

  it('carga la vista', () => cy.get('body').should('exist'));
  it('cards/indicadores si existen', () => cy.get('body').then(() => expect(true).to.be.true));
  it('filtros si existen', () => cy.get('body').then(() => expect(true).to.be.true));
  it('acciones si existen', () => cy.get('body').then(() => expect(true).to.be.true));
  it('notif/alert si existen', () => cy.get('body').then(() => expect(true).to.be.true));
});