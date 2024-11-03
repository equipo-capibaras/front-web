export default class SelectPlan {
  selectPlan(planTitle: string) {
    cy.contains('mat-card', planTitle).find('button.select-button').click();
  }

  confirmPlan() {
    cy.get('button').contains('Confirmar').click();
  }
}
