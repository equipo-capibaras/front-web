export default class CreateIncident {
  get email() {
    return cy.get('#form-client-register input[id="email"]');
  }

  get name() {
    return cy.get('#form-client-register input[id="name"]');
  }

  get description() {
    return cy.get('#form-client-register textarea[id="description"]');
  }

  get submitButton() {
    return cy.get('#form-client-register button[type="submit"]');
  }
}
