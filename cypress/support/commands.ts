// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

Cypress.Commands.add('login', () => {
  cy.fixture('user').then(({ email, password }) => {
    const requestOptions: Partial<Cypress.RequestOptions> = {
      url: 'https://barrigarest.wcaquino.me/signin',
      method: 'POST',
      body: {
        email,
        senha: password,
        redirecionar: false,
      },
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Origin: 'https://barrigareact.wcaquino.me',
        Referer: 'https://barrigareact.wcaquino.me',
      }
    }
  
    cy.request(requestOptions).then((response) => {
      cy.wrap(response).its('status').should('equal', 200)
  
      localStorage.setItem('@barriga/user', response.body.nome)
      localStorage.setItem('@barriga/token', response.body.token)
    })
  })
})

Cypress.Commands.add('resetDB', () => {
  cy.window().then(window => {
    const token = window.localStorage.getItem('@barriga/token')

    const requestOptions: Partial<Cypress.RequestOptions> = {
      url: 'https://barrigarest.wcaquino.me/reset',
      method: 'GET',
      headers: {
        Authorization: `JWT ${token}`,
        Host: 'barrigarest.wcaquino.me',
      }
    }
  
    cy.request(requestOptions).then((response) => {
      cy.wrap(response).its('status').should('equal', 200)
    })
  })
})

