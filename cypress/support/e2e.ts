declare global {
  namespace Cypress {
    interface Chainable {
      maybe<E extends HTMLElement = HTMLElement>(selector: string): Chainable<JQuery<E>>;
    }
  }
}

Cypress.Commands.add('maybe', (selector: string): Cypress.Chainable<JQuery<HTMLElement>> => {
  return cy.document().then((doc) => {
    const $found = Cypress.$<HTMLElement>(doc.body).find(selector) as JQuery<HTMLElement>;
    return cy.wrap<JQuery<HTMLElement>>($found);
  });
});

export {};
