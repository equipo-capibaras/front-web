import axe from 'axe-core';

function terminalLog(violations: axe.Result[]) {
  cy.task(
    'log',
    `${violations.length} accessibility violation${
      violations.length === 1 ? '' : 's'
    } ${violations.length === 1 ? 'was' : 'were'} detected`,
  );

  const violationData = violations.map(({ id, impact, description, nodes }) => ({
    id,
    impact,
    description,
    nodes: nodes.length,
  }));

  cy.task('table', violationData);
}

describe('Accessibility Tests', () => {
  it('Login page has no detectable a11y violations on load', () => {
    cy.visit('/');
    cy.injectAxe();
    cy.checkA11y(undefined, undefined, terminalLog);
  });
});
