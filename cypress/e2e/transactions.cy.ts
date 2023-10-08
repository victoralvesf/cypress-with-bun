import { header, home, layout, statement, transactions } from "@/support/locators"

describe('Transactions', () => {  
  beforeEach(() => {
    cy.login()
    cy.resetDB()
    cy.intercept('GET', '/saldo').as('loadBalanceRequest')
    cy.visit('/')
  })
  
  it('Should create a transaction', () => {
    cy.intercept('GET', '/contas').as('loadAccountsRequest')
    cy.intercept('POST', '/transacoes').as('saveTransactionRequest')
    
    cy.get(header.transactions).click()
    cy.wait('@loadAccountsRequest').its('response.statusCode').should('equal', 200)

    cy.get(transactions.description).type('Aluguel')
    cy.get(transactions.value).type('600')
    cy.get(transactions.associated).type('Seu Barriga')
    cy.get(transactions.account).select('Conta para movimentacoes')
    cy.get(transactions.status).click()

    cy.get(transactions.save).click()
    cy.wait('@saveTransactionRequest').its('response.statusCode').should('equal', 201)

    cy.get(layout.toastMessage).should('contain.text', 'Movimentação inserida com sucesso!')
    cy.get(statement.list)
      .filter(':contains("Aluguel")')
      .should('contain.text', '600,00')
      .should('contain.text', 'Seu Barriga')
  })

  it('Should see the transaction amount on the home page', () => {
    cy.wait('@loadBalanceRequest').its('response.statusCode').should('equal', 200)
    cy.intercept('GET', '/contas').as('loadAccountsRequest')
    cy.intercept('GET', '/extrato/**').as('loadStatementRequest')
    cy.intercept('GET', '/transacoes/*').as('loadTransactionRequest')
    cy.intercept('PUT', '/transacoes/*').as('editTransactionRequest')

    cy.get(home.accountsTableLines)
      .contains('td', 'Conta para saldo')
      .siblings()
      .should('include.text', '534,00')

    cy.get(header.statement).click()
    cy.wait('@loadStatementRequest').its('response.statusCode').should('equal', 200)
    
    cy.get(statement.editStatement('Movimentacao 1, calculo saldo')).click()
    cy.wait('@loadAccountsRequest').its('response.statusCode').should('equal', 200)
    cy.wait('@loadTransactionRequest').its('response.statusCode').should('equal', 200)
    
    cy.get(transactions.status).click()
    cy.get(transactions.save).click()

    cy.wait('@editTransactionRequest').its('response.statusCode').should('equal', 200)
    cy.get(layout.toastMessage).should('contain.text', 'Movimentação alterada com sucesso!')

    cy.get(header.home).click()
    cy.wait('@loadBalanceRequest').its('response.statusCode').should('equal', 200)

    cy.get(home.accountsTableLines)
      .contains('td', 'Conta para saldo')
      .siblings()
      .should('include.text', '4.034,00')
  })

  it('Should remove a transaction', () => {
    cy.intercept('GET', '/extrato/**').as('loadStatementRequest')
    cy.intercept('DELETE', '/transacoes/*').as('removeStatementRequest')

    cy.get(header.statement).click()
    cy.wait('@loadStatementRequest').its('response.statusCode').should('equal', 200)

    cy.get(statement.removeStatement('Movimentacao para exclusao')).click()

    cy.wait('@removeStatementRequest').its('response.statusCode').should('equal', 204)

    cy.get(layout.toastMessage).should('contain.text', 'Movimentação removida com sucesso!')
  })
})