import { getGreeting } from '../support/app.po';

describe('e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    cy.get('.title').contains(/Framer Doppelganger/);
  });
});
