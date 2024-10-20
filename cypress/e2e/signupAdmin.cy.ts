import { faker } from '@faker-js/faker';
import Admin from 'cypress/pageobjects/admin';
import ClientSignUp from 'cypress/pageobjects/clientSignUp';
import EmployeeSignUp from 'cypress/pageobjects/employeeSignUp';
import Login from 'cypress/pageobjects/login';
import Navbar from 'cypress/pageobjects/navbar';
import SelectPlan from 'cypress/pageobjects/selectPlan';

describe('Signup Admin', () => {
  it('Scenario: Admin signup', () => {
    cy.log('Step 1: Visit the home page');
    cy.visit('/');

    cy.log('Step 2: Visit the signup page');
    const login = new Login();
    login.goToRegister();
    cy.location('pathname').should('eq', '/register');

    cy.log('Step 3: Fill out the employee signup form with dynamic data');
    const randomEmail = faker.internet.email();
    const randomName = faker.person.firstName();
    const password = faker.internet.password();
    const employeeSignUp = new EmployeeSignUp();
    employeeSignUp.employeeRegister(randomName, randomEmail, 'admin', password, password);
    cy.location('pathname').should('eq', '/client/register');

    cy.log('Step 4: Fill out the compnay signup form with dynamic data');
    const randomCompanyEmail = faker.internet.userName();
    const randomCompanyName = faker.company.name();
    const clientSignUp = new ClientSignUp();
    clientSignUp.companyRegister(randomCompanyName, randomCompanyEmail);
    cy.location('pathname').should('eq', '/client/select-plan');

    cy.log('Step 5: Select plan');
    const selectPlan = new SelectPlan();
    selectPlan.selectPlan('Emprendedor');
    cy.location('pathname').should('eq', '/admin');

    cy.log('Step 6: Verify the list of employees shows at least one (the logged-in admin)');
    const adminPage = new Admin();
    adminPage.verifyPageContent();
    adminPage.verifyEmployeeExists(randomName, randomEmail);

    cy.log('Step 5: Logout');
    const navbar = new Navbar();
    navbar.logout.click();
  });
});
