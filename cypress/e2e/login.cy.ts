import Login from 'cypress/pageobjects/login';
import Navbar from 'cypress/pageobjects/navbar';

describe('Login', () => {
  enum Role {
    Admin = 'admin',
    Agent = 'agent',
    Analyst = 'analyst',
  }

  const expectedDefaultPaths = {
    [Role.Admin]: '/admin',
    [Role.Agent]: '/incidents',
    [Role.Analyst]: '/dashboards',
  };

  const expectedNavbarOptions = {
    [Role.Admin]: ['company', 'dashboards', 'invoice'],
    [Role.Agent]: ['incidents'],
    [Role.Analyst]: ['dashboards'],
  };

  Object.values(Role).forEach(role => {
    it(`Scenario 1 (${role})`, () => {
      cy.log('Step 1: Visit the home page');
      cy.visit('/');

      cy.log('Step 2: Login as ${role}');
      cy.fixture(`login.${role}.json`).then(loginData => {
        const login = new Login();
        login.login(loginData.email, loginData.password);
      });

      cy.log('I should be redirected to the default page');
      cy.location('pathname').should('eq', expectedDefaultPaths[role]);

      cy.log('I see the navbar options');
      const navbar = new Navbar();

      navbar.logout.should('exist');

      const options = expectedNavbarOptions[role];
      options.forEach(option => {
        navbar[option]!.should('exist');
      });

      cy.log('Step 3: I return to the home page');
      cy.visit('/');

      cy.log('I should not be required to login again and be redirected to the default page');
      cy.location('pathname').should('eq', expectedDefaultPaths[role]);

      cy.log('Step 4: I logout');
      navbar.logout.click();

      cy.log('I should be redirected to the login page');
      cy.location('pathname').should('eq', '/');
    });
  });
});
