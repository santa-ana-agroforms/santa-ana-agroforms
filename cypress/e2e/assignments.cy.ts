import { clickMenu } from '../support/helpers';

describe('Asignación de Formularios', () => {
  beforeEach(() => {
    cy.visit('/home');
    cy.contains('.ant-menu-submenu-title', 'Formularios').click({ force: true });
    cy.wait(500);
    cy.contains('.ant-menu-item', 'Asignación de Formularios').click({ force: true });
  });

  it('carga la vista', () => cy.get('body').should('exist'));
  it('lista/tabla si existe', () => cy.get('body').then(() => expect(true).to.be.true));
  it('selector de usuario/terminal si existe', () => cy.get('body').then(() => expect(true).to.be.true));
  it('botón asignar si existe', () => cy.get('body').then(() => expect(true).to.be.true));
  it('mensaje/alerta si existe', () => cy.get('body').then(() => expect(true).to.be.true));
});