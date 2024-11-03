import { faker } from '@faker-js/faker';
import Login from 'cypress/pageobjects/login';
import Navbar from 'cypress/pageobjects/navbar';
import IncidentList from 'cypress/pageobjects/incidentList';
import CreateIncident from 'cypress/pageobjects/createIncident';
import IncidentDetail from 'cypress/pageobjects/incidentDetail';
import ChangeStatus from 'cypress/pageobjects/changeStatus';

describe('Incident Management', () => {
  it('Scenario: Create incident', () => {
    cy.log('Step 1: Visit the home page');
    cy.visit('/');

    cy.log('Step 2: Login as agent');
    cy.fixture(`login.agent.json`).then(loginData => {
      const login = new Login();
      login.login(loginData.email, loginData.password);
    });

    cy.log('Step 3: Create incident');
    const incidentList = new IncidentList();
    incidentList.createIncidentButton.click();

    const createIncident = new CreateIncident();
    const incidentName = faker.lorem.words(3);
    const incidentDescription = faker.lorem.words(10);
    createIncident.email.type('lucas.hs@example.org', { force: true });
    createIncident.name.type(incidentName, { force: true });
    createIncident.description.type(incidentDescription, { force: true });
    createIncident.submitButton.click();

    cy.log('Step 4: Verify incident created');
    incidentList.verifyIncidentExists(incidentName);

    cy.log('Step 5: Open incident');
    incidentList.openIncident(incidentName);

    cy.log('Step 6: Verify incident details');
    const incidentDetail = new IncidentDetail();
    incidentDetail.verifyDescription(incidentDescription);
    incidentDetail.verifyStatus('Abierta');

    cy.log('Step 7: Open change status');
    incidentDetail.changeStatusButton.click();

    cy.log('Step 8: Change status to closed');
    const changeStatus = new ChangeStatus();
    changeStatus.selectStatus('closed');
    changeStatus.comment.type(faker.lorem.words(10), { force: true });
    changeStatus.submitButton.click();

    cy.log('Step 9: Verify status changed');
    incidentDetail.verifyStatus('Cerrado');

    cy.log('Step 10: Logout');
    const navbar = new Navbar();
    navbar.logout.click();
  });
});
