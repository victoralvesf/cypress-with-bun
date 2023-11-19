const getAccountsRoute = { method: 'GET', path: '/contas', times: 1 }
const createAccountRoute = { method: 'POST', path: '/contas', times: 1 }
const editAccountRoute = (id: string) => ({ method: 'PUT', path: `/contas/${id}`, times: 1 })
const removeAccountRoute = (id: string) => ({ method: 'DELETE', path: `/contas/${id}`, times: 1 })

const getTransactionRoute = (id: string) => ({ method: 'GET', path: `/transacoes/${id}`, times: 1 })
const createTransactionRoute = { method: 'POST', path: '/transacoes', times: 1 }
const updateTransactionRoute = { method: 'PUT', path: '/transacoes/3', times: 1 }
const removeTransactionRoute = (id: string) => ({ method: 'DELETE', path: `/transacoes/${id}`, times: 1 })

const getStatementRoute = { method: 'GET', path: '/extrato/**?orderBy=data_pagamento', times: 1 }


export const stubs = {
  auth: {
    login: () => cy.intercept('POST', '/signin', { fixture: 'ui/auth/login' }).as('signin'),
  },
  balance: {
    get: () => cy.intercept('GET', '/saldo', { fixture: 'ui/balance/get' }).as('getBalance'),
    updated: () => cy.intercept('GET', '/saldo', { fixture: 'ui/balance/updated' }).as('updatedbalance'),
  },
  account: {
    get: () => cy.intercept(getAccountsRoute, { fixture: 'ui/account/get' }).as('getAccounts'),
    create: () => cy.intercept(createAccountRoute, { statusCode: 201 }).as('createAccount'),
    created: () => cy.intercept(getAccountsRoute, { fixture: 'ui/account/created' }).as('createdAccounts'),
    existing: () => cy.intercept(createAccountRoute, { statusCode: 400, fixture: 'ui/account/existing' }).as('createExistingAccount'),
    update: () => cy.intercept(editAccountRoute('1'), { statusCode: 200 }).as('updateAccount'),
    updated: () => cy.intercept(getAccountsRoute, { fixture: 'ui/account/updated' }).as('updatedAccounts'),
    remove: () => cy.intercept(removeAccountRoute('1'), { statusCode: 204 }).as('removeAccount'),
    removed: () => cy.intercept(getAccountsRoute, { fixture: 'ui/account/deleted' }).as('removedAccounts')
  },
  transactions: {
    getOne: () => cy.intercept(getTransactionRoute('3'), { fixture: 'ui/transaction/one' }).as('getOneTransaction'),
    create: () => cy.intercept(createTransactionRoute, { statusCode: 201 }).as('createTransaction'),
    update: () => cy.intercept(updateTransactionRoute, { statusCode: 200 }).as('updateTransaction'),
    remove: () => cy.intercept(removeTransactionRoute('2'), { statusCode: 204 }).as('removeTransaction'),
  },
  statement: {
    get: () => cy.intercept(getStatementRoute, { fixture: 'ui/statement/get' }).as('getStatement'),
    update: () => cy.intercept(getStatementRoute, { fixture: 'ui/statement/update' }).as('updateStatement'),
    updated: () => cy.intercept(getStatementRoute, { fixture: 'ui/statement/update' }).as('updatedStatements'),
    removed: () => cy.intercept(getStatementRoute, { fixture: 'ui/statement/deleted' }).as('removedStatements'),
  }
}