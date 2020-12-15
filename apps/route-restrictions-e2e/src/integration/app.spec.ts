import { getToolbar, getText } from '../support/app.po';

describe('route-restrictions', () => {
  beforeEach(() => cy.visit('/'));

  it('should display home page text', () => {
    getToolbar().contains('Route restrictions');
    getText().contains('This route is OPEN');
  });
});
