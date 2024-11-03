export default class ChangeStatus {
  get statusDropdown() {
    return cy.get('mat-select[formcontrolname="status"]');
  }

  get comment() {
    return cy.get('textarea[formcontrolname="comment"]');
  }

  get submitButton() {
    return cy.get('button[type="submit"]');
  }

  selectStatus(status: string) {
    this.statusDropdown.click();
    cy.get(`mat-option[value="${status}"]`).click();
  }
}
