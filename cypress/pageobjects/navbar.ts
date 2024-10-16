export default class Navbar {
  [key: string]: Cypress.Chainable | undefined;

  get company() {
    return cy.get('nav button[id="btn-company"]');
  }

  get dashboards() {
    return cy.get('nav button[id="btn-dashboards"]');
  }

  get invoice() {
    return cy.get('nav button[id="btn-invoice"]');
  }

  get incidents() {
    return cy.get('nav button[id="btn-incidents"]');
  }

  get myaccount() {
    return cy.get('nav button[id="btn-myaccount"]');
  }

  get logout() {
    return cy.get('nav button[id="btn-logout"]');
  }
}
