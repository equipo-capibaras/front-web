export default class ClientSignUp {
  get companyName() {
    return cy.get('#form-client-register input[id="name"]');
  }

  get companyEmail() {
    return cy.get('#form-client-register input[id="email"]');
  }

  get submit() {
    return cy.get('#form-client-register button[type="submit"]');
  }

  companyRegister(name: string, email: string) {
    this.companyName.type(name);
    this.companyEmail.type(email);
    this.submit.click();
  }
}
