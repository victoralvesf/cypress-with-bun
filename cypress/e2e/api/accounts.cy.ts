import { AccountResponse, RequestOptions } from "@/support"

describe('Accounts API', () => { 
  beforeEach(() => {
    cy.login()
    cy.resetDB()
  })

  it('Should create an account', () => {
    const createAccountRequest: RequestOptions = {
      url: '/contas',
      method: 'POST',
      body: {
        nome: 'Conta criada via API'
      }
    }

    cy.api(createAccountRequest, 'Create Account').then((response) => {
      expect(response.status).to.be.equal(201)

      expect(response.body).to.have.property('id')
      expect(response.body).to.have.property('nome', 'Conta criada via API')
      expect(response.body).to.have.property('usuario_id')
      expect(response.body).to.have.property('visivel')
    })
  })

  it('Should not create an existing account', () => {
    const createExistingAccountRequest: RequestOptions = {
      url: '/contas',
      method: 'POST',
      body: {
        nome: 'Conta mesmo nome'
      },
      failOnStatusCode: false
    }

    cy.api(createExistingAccountRequest, 'Create Existing Account').then((response) => {
      expect(response.status).to.be.equal(400)

      expect(response.body.error).to.be.equal('Já existe uma conta com esse nome!')
    })
  })
  
  it('Should edit an account', () => {
    cy.getAccountByName('Conta para alterar').then(account => {
      const updateAccountRequest: RequestOptions = {
        url: `/contas/${account.id}`,
        method: 'PUT',
        body: {
          nome: 'Conta alterada via REST'
        }
      }

      cy.api<AccountResponse>(updateAccountRequest, 'Edit Account').then((response) => {
        expect(response.status).to.be.equal(200)
  
        expect(response.body).to.have.property('id', account.id)
        expect(response.body).to.have.property('nome', 'Conta alterada via REST')
        expect(response.body).to.have.property('usuario_id')
        expect(response.body).to.have.property('visivel')
      })
    })
  })
  
  it('Should remove an account', () => {
    cy.getAccountByName('Conta mesmo nome').then(account => {
      const removeAccountRequest: RequestOptions = {
        url: `/contas/${account.id}`,
        method: 'DELETE',
      }

      cy.api<AccountResponse>(removeAccountRequest, 'Remove Account').then((response) => {
        expect(response.status).to.be.equal(204)
      })
    })
  })
})