/**
 * Retrieves the greeting element from the DOM.
 *
 * This function uses Cypress to select the first `<h1>` element on the page,
 * which is typically used to display a greeting message. It is useful in
 * end-to-end testing scenarios where you want to assert the presence or
 * content of a greeting.
 *
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} A Cypress chainable object
 * that represents the selected `<h1>` element.
 *
 * @example
 * // Usage in a test case
 * getGreeting().should('contain', 'Welcome');
 */
export const getGreeting = () => cy.get('h1');
