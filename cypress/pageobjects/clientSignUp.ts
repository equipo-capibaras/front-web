export default class ClientSignUp {
  get companyName() {
    return cy.get('input[id="name"]');
  }

  get companyEmail() {
    return cy.get('input[id="email"]');
  }

  get submit() {
    return cy.get('button[type="submit"]');
  }

  companyRegister(name: string, email: string) {
    this.companyName.type(name);
    this.companyEmail.type(email);
    this.submit.click();
  }
}
