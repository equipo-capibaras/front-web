export default class IncidentDetail {
  verifyDescription(description: string) {
    cy.contains('p', description).should('exist');
  }

  verifyStatus(status: string) {
    cy.contains('mat-chip', status).should('exist');
  }

  get changeStatusButton() {
    return cy.get('button').contains('Cambiar estado');
  }
}
