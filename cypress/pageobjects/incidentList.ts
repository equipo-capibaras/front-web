export default class IncidentList {
  getIncidentButton(index: number) {
    return cy.get('button[aria-label="Ver incidente"]').eq(index);
  }

  get createIncidentButton() {
    return cy.get('button[routerlink="/incidents/new"]');
  }

  verifyIncidentExists(incidentName: string) {
    cy.contains('td.mat-column-name', incidentName).should('exist');
  }

  openIncident(incidentName: string) {
    cy.contains('td.mat-column-name', incidentName)
      .parent()
      .find('button[aria-label="Ver incidente"]')
      .click();
  }
}
