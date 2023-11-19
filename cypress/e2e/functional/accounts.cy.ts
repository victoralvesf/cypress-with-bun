import { accounts, header, layout } from "@/support/locators"

describe('Accounts', () => { 
  beforeEach(() => {
    cy.login()
    cy.resetDB()
    cy.visit('/')
    cy.gotoAccountsPage()
  })

  it('Should create an account', () => {    
    cy.get(accounts.nameInput).type('Conta de teste')
    cy.get(accounts.saveButton).click()

    cy.get(layout.toastMessage).should('contain.text', 'Conta inserida com sucesso!')
  })

  it('Should not create an existing account', () => {    
    cy.get(accounts.nameInput).type('Conta mesmo nome')
    cy.get(accounts.saveButton).click()

    cy.get(layout.toastMessage).should('contain.text', 'Request failed with status code 400')
  })
  
  it('Should edit an account', () => {    
    cy.get(accounts.editAccountWithText('Conta para alterar')).click()

    cy.get(accounts.nameInput).should('have.value', 'Conta para alterar')
    cy.get(accounts.nameInput).clear().type('Conta alterada')
    cy.get(accounts.saveButton).click()

    cy.get(layout.toastMessage).should('contain.text', 'Conta atualizada com sucesso!')
    cy.contains('td', 'Conta alterada').should('be.visible')
  })
  
  it('Should remove an account', () => {
    cy.get(accounts.removeAccountWithText('Conta para alterar')).click()
    
    cy.get(layout.toastMessage).should('contain.text', 'Conta excluída com sucesso!')
  })
})