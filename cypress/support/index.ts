export {}

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to make login programatically.
       * @example cy.login()
       */
      login(): Chainable<void>
      /**
       * Custom command reset the test data.
       * @example cy.resetDB()
       */
      resetDB(): Chainable<void>
    }
  }
}