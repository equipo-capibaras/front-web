export default class EmployeeSignUp {
  get employeeName() {
    return cy.get('input[id="name"]');
  }

  get employeeEmail() {
    return cy.get('input[id="email"]');
  }

  get password() {
    return cy.get('input[id="password"]');
  }

  get confirmPassword() {
    return cy.get('input[id="passwordConfirmation"]');
  }

  get roleDropdown() {
    return cy.get('mat-select[formcontrolname="role"]');
  }

  get submit() {
    return cy.get('button[type="submit"]');
  }

  selectRole(role: string) {
    this.roleDropdown.click();
    cy.get(`mat-option[value="${role}"]`).click();
  }

  employeeRegister(
    name: string,
    email: string,
    role: string,
    password: string,
    confirmPassword: string,
  ) {
    this.employeeName.type(name);
    this.employeeEmail.type(email);
    this.selectRole(role);
    this.password.type(password);
    this.confirmPassword.type(confirmPassword, { force: true });
    this.submit.click();
  }

  checkClientEmailHint() {
    this.clientEmailHint.should('contain', '@capibaras.io');
  }
}
