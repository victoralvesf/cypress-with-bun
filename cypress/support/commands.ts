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

import { AccountResponse, RequestOptions } from "."

const apiBaseUrl = Cypress.env('apiBaseUrl') as string

Cypress.Commands.overwrite('request', (originalFn, ...options) => {
  if (options.length === 1) {
    if (Cypress.env('jwt_token')) {
      options[0].headers = {
        ...options[0].headers,
        Authorization: Cypress.env('jwt_token') as string
      }
    }
    if (Cypress.env('apiBaseUrl')) {
      options[0].url = apiBaseUrl + options[0].url
    }
  }

  return originalFn(...options)
})

Cypress.Commands.add('login', () => {
  cy.fixture('user').then(({ email, password }) => {
    const requestOptions: RequestOptions = {
      url: '/signin',
      method: 'POST',
      body: {
        email,
        senha: password,
        redirecionar: false,
      }
    }
  
    cy.request(requestOptions).then((response) => {
      cy.wrap(response).its('status').should('equal', 200)

      localStorage.setItem('@barriga/user', response.body.nome)
      localStorage.setItem('@barriga/token', response.body.token)
      
      Cypress.env('jwt_token', `JWT ${response.body.token}`)
    })
  })
})

Cypress.Commands.add('resetDB', () => {
  const requestOptions: RequestOptions = {
    url: '/reset',
    method: 'GET',
    headers: {
      Host: 'barrigarest.wcaquino.me',
    }
  }

  cy.request(requestOptions).then((response) => {
    cy.wrap(response).its('status').should('equal', 200)
  })
})

Cypress.Commands.add('getAccountByName', (name) => {
  cy.api<AccountResponse[]>({
    url: '/contas',
    method: 'GET',
    qs: {
      nome: name
    }
  }).then((response) => {
    expect(response.status).to.be.equal(200)
    expect(response.body[0].id).to.exist

    return response.body[0]
  })
})

Cypress.Commands.add('getTransactionByName', (name) => {
  cy.api<AccountResponse[]>({
    url: '/transacoes',
    method: 'GET',
    qs: {
      descricao: name
    }
  }).then((response) => {
    expect(response.status).to.be.equal(200)
    expect(response.body[0].id).to.exist

    return response.body[0]
  })
})
