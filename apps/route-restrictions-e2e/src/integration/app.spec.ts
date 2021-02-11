import {
  getToolbar,
  getText,
  getNavigationLinks,
  getToggleButton,
  getRestrictionLabel,
} from '../support/app.po';

describe('route-restrictions', () => {
  it('should display home page text', () => {
    cy.visit('/');
    getToolbar().contains('Route restrictions');
    getText().contains('This route is OPEN');
    getToggleButton().should('be.visible');
  });

  it('should display toggle button and restriction', () => {
    cy.visit('/');
    getToggleButton().should('be.visible');
    getRestrictionLabel().should('contain.text', 'OFF');
  });

  it('should toggle restriction on toggle click', () => {
    cy.visit('/');
    getRestrictionLabel().should('contain.text', 'OFF');
    getToggleButton().click();
    getRestrictionLabel().should('contain.text', 'ON');
  });

  it('should display restrictions page text', () => {
    cy.visit('/restricted');
    getText().contains('This route is restricted');
  });

  it('should switch to restrictions on nav click', () => {
    cy.visit('/');
    getNavigationLinks().eq(1).click();
    cy.url().should('eq', 'http://localhost:4200/restricted');
    getText().contains('This route is restricted');
  });

  it('should redirect to home page when restriction is set', () => {
    cy.visit('/restricted');
    getToggleButton().click();
    cy.url().should('eq', 'http://localhost:4200/');
    getText().contains('This route is OPEN');
  });

  it('should redirect to home page when restriction is set on nav click', () => {
    cy.visit('/');
    getToggleButton().click();
    getNavigationLinks().eq(1).click();
    cy.url().should('eq', 'http://localhost:4200/');
    getText().contains('This route is OPEN');
  });
});
