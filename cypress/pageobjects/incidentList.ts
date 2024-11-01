export default class IncidentList {
  getIncidentButton(index: number) {
    return cy.get('button[aria-label="Ver incidente"]').eq(index);
  }
}
