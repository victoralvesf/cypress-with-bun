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
import { stubs } from "./intercepts"
import { header, login, statement, transactions } from "./locators"

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

Cypress.Commands.add('loginUI', (options) => {
  stubs.auth.login()
  if (options?.stub) stubs.balance.get()

  cy.get(login.emailInput).type('fake user')
  cy.get(login.passwordInput).type('fake pass')
  cy.get(login.submitButton).click()
})

Cypress.Commands.add('gotoAccountsPage', (options) => {
  if (options?.stub) stubs.account.get()
  cy.get(header.accounts).click({ force: true })
  cy.get('h2').should('have.text', 'Contas')
})

Cypress.Commands.add('gotoTransactionsPage', (options) => {
  if (options?.stub) stubs.account.get()
  cy.get(header.transactions).click({ force: true })
  cy.get(transactions.associated).should('exist')
})

Cypress.Commands.add('gotoStatementsPage', (options) => {
  if (options?.stub) stubs.statement.get()
  cy.get(header.statement).click({ force: true })
  cy.get(statement.list).should('exist')
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
