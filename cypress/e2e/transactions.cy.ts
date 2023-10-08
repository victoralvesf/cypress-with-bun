import { header, home, layout, statement, transactions } from "@/support/locators"

describe('Transactions', () => {  
  beforeEach(() => {
    cy.login()
    cy.resetDB()
    cy.visit('/')
  })
  
  it('Should create a transaction', () => {    
    cy.get(header.transactions).click()

    cy.get(transactions.description).type('Aluguel')
    cy.get(transactions.value).type('600')
    cy.get(transactions.associated).type('Seu Barriga')
    cy.get(transactions.account).select('Conta para movimentacoes')
    cy.get(transactions.status).click()

    cy.get(transactions.save).click()

    cy.get(layout.toastMessage).should('contain.text', 'Movimentação inserida com sucesso!')
    cy.get(statement.list)
      .filter(':contains("Aluguel")')
      .should('contain.text', '600,00')
      .should('contain.text', 'Seu Barriga')
  })

  it('Should see the transaction amount on the home page', () => {
    cy.get(home.accountsTableLines)
      .contains('td', 'Conta para saldo')
      .siblings()
      .should('include.text', '534,00')

    cy.get(header.statement).click()
    
    cy.get(statement.editStatement('Movimentacao 1, calculo saldo')).click()
    cy.get(transactions.description).should('have.value', 'Movimentacao 1, calculo saldo')
    cy.get(transactions.account).find(':selected').should('have.text', 'Conta para saldo')
    
    cy.get(transactions.status).click()
    cy.get(transactions.save).click()

    cy.get(layout.toastMessage).should('contain.text', 'Movimentação alterada com sucesso!')

    cy.get(header.home).click()

    cy.get(home.accountsTableLines)
      .contains('td', 'Conta para saldo')
      .siblings()
      .should('include.text', '4.034,00')
  })

  it('Should remove a transaction', () => {
    cy.get(header.statement).click()

    cy.get(statement.removeStatement('Movimentacao para exclusao')).click()

    cy.get(layout.toastMessage).should('contain.text', 'Movimentação removida com sucesso!')
  })
})