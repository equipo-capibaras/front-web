describe('My Second Test', () => {
  it('Should contain ABCall', () => {
    cy.visit('/');
    cy.contains('ABCall');
  });
});
