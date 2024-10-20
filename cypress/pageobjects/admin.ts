export default class Admin {
  get pageTitle() {
    return cy.get('.page__title');
  }

  get pageDescription() {
    return cy.get('.page__description');
  }

  get employeeList() {
    return cy.get('table');
  }

  verifyPageContent() {
    this.pageTitle.should('contain', 'Gestión empresa');
    this.pageDescription.should('contain', 'ver e invitar fácilmente a tus empleados');
  }

  verifyEmployeeExists(employeeName: string, employeeEmail: string) {
    this.employeeList.within(() => {
      cy.contains('td', employeeName).should('exist');
      cy.contains('td', employeeEmail).should('exist');
    });
  }
}
