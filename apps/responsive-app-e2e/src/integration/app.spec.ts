import {
  getToolbar,
  getNavigationLinks,
  getPrimaryButton,
} from '../support/app.po';

describe('responsive-app', () => {
  it('should show toolbar', () => {
    cy.visit('/');
    getToolbar().contains('Responsive demo');
  });
  it('should redirect to dashboard on desktop', () => {
    cy.viewport('macbook-13');
    cy.visit('/');
    cy.url().should('eq', 'http://localhost:4200/dashboard');
  });
  it('should not redirect to dashboard on mobile', () => {
    cy.viewport('iphone-6');
    cy.visit('/');
    cy.url().should('eq', 'http://localhost:4200/');
  });
  it('should redirect from dashboard to root when switching to mobile', () => {
    cy.viewport('macbook-13');
    cy.visit('/');
    cy.viewport('iphone-6');
    cy.url().should('eq', 'http://localhost:4200/');
  });
  it('should redirect from root to dashboard when switching to desktop', () => {
    cy.viewport('iphone-6');
    cy.visit('/');
    cy.viewport('macbook-13');
    cy.url().should('eq', 'http://localhost:4200/dashboard');
  });

  context('desktop resolution', () => {
    beforeEach(() => {
      cy.viewport('macbook-13');
      cy.visit('/');
    });

    it('should show links and info on desktop', () => {
      getNavigationLinks().should('have.length', 6);
      cy.get('h2').contains('Select user profile!');
    });

    it('can click on link on desktop', () => {
      getNavigationLinks().eq(2).click();
      cy.url().should('eq', 'http://localhost:4200/3');
      cy.get('h2').contains('User 3');
    });

    it('should show links on desktop profile', () => {
      cy.visit('/3');
      getNavigationLinks().should('have.length', 6);
    });

    it('should not show back button on desktop profile', () => {
      cy.visit('/3');
      getPrimaryButton().should('have.length', 0);
    });
  });

  context('mobile resolution', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
      cy.visit('/');
    });

    it('should show only links on mobile', () => {
      getNavigationLinks().should('have.length', 5);
      cy.get('h2').should('have.length', 0);
    });
    it('can click on link on mobile', () => {
      getNavigationLinks().eq(2).click();
      cy.url().should('eq', 'http://localhost:4200/3');
      cy.get('h2').contains('User 3');
    });
    it('should not show links on mobile profile', () => {
      cy.visit('/3');
      getNavigationLinks().should('have.length', 0);
    });
    it('should show back button on mobile profile', () => {
      cy.visit('/3');
      getPrimaryButton().should('have.length', 1);
    });
    it('should navigate back to root on mobile after primary back button click', () => {
      cy.visit('/3');
      getPrimaryButton().click();
      cy.url().should('eq', 'http://localhost:4200/');
    });
  });
});
