export const getToolbar = () => cy.get('mat-toolbar');
export const getPrimaryButton = () => cy.get('section a.mat-primary');
export const getSecondaryButton = () =>
  cy.get('section a.mat-button-base:not(.mat-primary)');
