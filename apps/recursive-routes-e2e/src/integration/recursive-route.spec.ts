import {
  getPrimaryButton,
  getToolbar,
  getSecondaryButton,
} from '../support/app.po';

describe('recursive-routes', () => {
  beforeEach(() => cy.visit('/'));

  it('should show toolbar', () => {
    getToolbar().contains('Recursive routes');
  });

  it('should show simpson links', () => {
    getPrimaryButton().should('have.length', 8);
    getPrimaryButton()
      .first()
      .find('.mat-button-wrapper')
      .contains('Homer Simpson');
    getPrimaryButton()
      .last()
      .find('.mat-button-wrapper')
      .contains('Selma Bouvier');
  });
  it('is possible to select Abe Simpson', () => {
    getPrimaryButton().eq(5).click();
    // check
    getPrimaryButton().should('have.length', 4);
    getSecondaryButton().find('.mat-button-wrapper').contains('Abe Simpson');
    cy.url().should('eq', 'http://localhost:4200/6');
  });
  it('is possible to select Patty after Bart after Abe', () => {
    getPrimaryButton().eq(5).click();
    getPrimaryButton().eq(1).click();
    getPrimaryButton().eq(5).click();
    // check
    getPrimaryButton().should('have.length', 5);
    getSecondaryButton().should('have.length', 3);
    getSecondaryButton()
      .last()
      .find('.mat-button-wrapper')
      .contains('Patty Bouvier');
    cy.url().should('eq', 'http://localhost:4200/6/3/7');
  });
  it('is possible to navigate back', () => {
    // prepare
    getPrimaryButton().eq(5).click();
    getPrimaryButton().eq(1).click();
    getPrimaryButton().eq(5).click();
    cy.url().should('eq', 'http://localhost:4200/6/3/7');
    // navigate back
    getSecondaryButton().first().click();
    // check
    getSecondaryButton().should('have.length', 1);
    getSecondaryButton().find('.mat-button-wrapper').contains('Abe Simpson');
    cy.url().should('eq', 'http://localhost:4200/6');
  });
});
