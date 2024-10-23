export default class EmployeeSignUp {
  get employeeName() {
    return cy.get('#form-employee-register input[id="name"]');
  }

  get employeeEmail() {
    return cy.get('#form-employee-register input[id="email"]');
  }

  get password() {
    return cy.get('#form-employee-register input[id="password"]');
  }

  get confirmPassword() {
    return cy.get('#form-employee-register input[id="passwordConfirmation"]');
  }

  get roleDropdown() {
    return cy.get('#form-employee-register mat-select[formcontrolname="role"]');
  }

  get submit() {
    return cy.get('#form-employee-register button[type="submit"]');
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
}
