export default class Login {
  get email() {
    return cy.get('input[type="email"]');
  }

  get password() {
    return cy.get('input[type="password"]');
  }

  get submit() {
    return cy.get('button[type="submit"]');
  }

  get registerLink() {
    return cy.get('.register-link a');
  }

  login(email: string, password: string) {
    this.email.type(email);
    this.password.type(password);
    this.submit.click();
  }

  goToRegister() {
    this.registerLink.click();
  }
}
