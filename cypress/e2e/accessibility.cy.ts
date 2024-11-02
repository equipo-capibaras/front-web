import axe from 'axe-core';
import IncidentList from 'cypress/pageobjects/incidentList';
import Login from 'cypress/pageobjects/login';

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
  it('`/` page has no detectable a11y violations on load', () => {
    cy.visit('/');

    cy.wait(2000);

    cy.injectAxe();
    cy.checkA11y(undefined, undefined, terminalLog);
  });

  it('`/register` page has no detectable a11y violations on load', () => {
    cy.visit('/register');

    cy.wait(2000);

    cy.injectAxe();
    cy.checkA11y(undefined, undefined, terminalLog);
  });

  it('`/admin` page has no detectable a11y violations on load', () => {
    cy.visit('/');

    cy.fixture('login.admin.json').then(loginData => {
      const login = new Login();
      login.login(loginData.email, loginData.password);
    });

    cy.location('pathname').should('eq', '/admin');

    cy.wait(2000);

    cy.injectAxe();
    cy.checkA11y(undefined, undefined, terminalLog);
  });

  it('`/dashboards` page has no detectable a11y violations on load', () => {
    cy.visit('/');

    cy.fixture('login.analyst.json').then(loginData => {
      const login = new Login();
      login.login(loginData.email, loginData.password);
    });

    cy.location('pathname').should('eq', '/dashboards');

    cy.wait(2000);

    cy.injectAxe();
    cy.checkA11y(undefined, undefined, terminalLog);
  });

  it('`/incidents` page has no detectable a11y violations on load', () => {
    cy.visit('/');

    cy.fixture('login.agent.json').then(loginData => {
      const login = new Login();
      login.login(loginData.email, loginData.password);
    });

    cy.location('pathname').should('eq', '/incidents');

    cy.wait(2000);

    cy.injectAxe();
    cy.checkA11y(undefined, undefined, terminalLog);
  });

  it('`/incidents/:id` page has no detectable a11y violations on load', () => {
    cy.visit('/');

    cy.fixture('login.agent.json').then(loginData => {
      const login = new Login();
      login.login(loginData.email, loginData.password);
    });

    cy.location('pathname').should('eq', '/incidents');

    cy.wait(2000);

    const incidentList = new IncidentList();

    incidentList.getIncidentButton(0).click();

    cy.wait(2000);

    cy.injectAxe();
    cy.checkA11y(undefined, undefined, terminalLog);
  });
});
