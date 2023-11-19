import { stubs } from "@/support/intercepts"
import { accounts, header, layout } from "@/support/locators"

describe('Accounts', () => { 
  beforeEach(() => {
    cy.visit('/')
    cy.loginUI()
    cy.gotoAccountsPage({ stub: true })
  })

  it('Should create an account', () => {
    stubs.account.create()
    cy.get(accounts.nameInput).type('Conta de teste')
    stubs.account.created()
    cy.get(accounts.saveButton).click({ force: true })
    
    cy.get(layout.toastMessage).should('contain.text', 'Conta inserida com sucesso!')
    cy.get(accounts.getAccountByName('Conta de teste')).should('be.visible')
  })

  it('Should not create an existing account', () => {
    stubs.account.existing()

    cy.get(accounts.nameInput).type('Conta mesmo nome')
    cy.get(accounts.saveButton).click()

    cy.get(layout.toastMessage).should('contain.text', 'Request failed with status code 400')
  })
  
  it('Should edit an account', () => {
    stubs.account.update()

    cy.get(accounts.editAccountWithText('Conta fake')).click()

    cy.get(accounts.nameInput).should('have.value', 'Conta fake')
    cy.get(accounts.nameInput).clear().type('Conta fake alterada')
    stubs.account.updated()
    cy.get(accounts.saveButton).click()

    cy.get(layout.toastMessage).should('contain.text', 'Conta atualizada com sucesso!')
    cy.contains('td', 'Conta fake alterada').should('be.visible')
  })
  
  it('Should remove an account', () => {
    stubs.account.remove()    
    stubs.account.removed()

    cy.get(accounts.removeAccountWithText('Conta fake')).click()

    cy.get(layout.toastMessage).should('contain.text', 'Conta excluída com sucesso!')
    cy.contains('td', 'Conta fake').should('not.exist')
  })
})