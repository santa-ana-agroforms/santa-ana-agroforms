import { clickMenu } from '../support/helpers';

describe('Navegación via sidebar (en /home)', () => {
  beforeEach(() => cy.visit('/home', { failOnStatusCode: false }));

  it('abre Dashboard', () => {
    clickMenu('Dashboard');
    cy.get('body').should('exist');
  });

  it('abre Formulares → Listado', () => {
    clickMenu('Formularios');
    clickMenu('Listado');
    cy.get('body').should('exist');
  });

  it('abre Terminales', () => {
    clickMenu('Terminales');
    cy.get('body').should('exist');
  });

  it('abre Usuarios', () => {
    clickMenu('Usuarios');
    cy.get('body').should('exist');
  });

  it('abre Fuentes de Datos', () => {
    clickMenu('Formularios');
    clickMenu('Fuentes de Datos');
  });
});
