import { BalanceResponse, RequestOptions } from "@/support"

describe('Transactions API', () => { 
  beforeEach(() => {
    cy.login()
    cy.resetDB()
  })
  
  it('Should create a transaction', () => {
    cy.getAccountByName('Conta para movimentacoes').then(account => {
      const createTransactionRequest: RequestOptions = {
        url: '/transacoes',
        method: 'POST',
        body: {
          tipo: 'REC',
          data_transacao: Cypress.dayjs().format('DD/MM/YYYY'),
          data_pagamento: Cypress.dayjs().add(1, 'day').format('DD/MM/YYYY'),
          descricao: 'Movimentacao criada via API',
          valor: '175',
          envolvido: 'Barriga',
          conta_id: account.id,
          status: true
        }
      }

      cy.api(createTransactionRequest, 'Create Transaction').then((response) => {
        expect(response.status).to.be.equal(201)
  
        expect(response.body).to.have.property('id')
        expect(response.body).to.have.property('data_pagamento')
        expect(response.body).to.have.property('data_transacao')
        expect(response.body.descricao).to.be.equal('Movimentacao criada via API')
        expect(response.body.envolvido).to.be.equal('Barriga')
        expect(response.body.tipo).to.be.equal('REC')
        expect(response.body.valor).to.be.equal('175.00')
      })
    })
  })

  it('Should add the transaction amount to the account balance', () => {
    const fetchBalanceRequest: RequestOptions = {
      url: '/saldo',
      method: 'GET',
    }

    cy.api<BalanceResponse[]>(fetchBalanceRequest, 'Get Balance').then(response => {
      expect(response.status).to.be.equal(200)

      const [balance] = response.body.filter(balance => balance.conta === 'Conta para saldo')

      expect(balance.saldo).to.be.equal('534.00')
    })

    cy.getAccountByName('Conta para saldo').then(account => {
      const createTransactionRequest: RequestOptions = {
        url: '/transacoes',
        method: 'POST',
        body: {
          tipo: 'REC',
          data_transacao: Cypress.dayjs().format('DD/MM/YYYY'),
          data_pagamento: Cypress.dayjs().add(1, 'day').format('DD/MM/YYYY'),
          descricao: 'Movimentacao para mudar saldo',
          valor: '2550',
          envolvido: 'Rest',
          conta_id: account.id,
          status: true
        }
      }

      cy.api(createTransactionRequest, 'Create Transaction').then((response) => {
        expect(response.status).to.be.equal(201)
      })
    })

    cy.api<BalanceResponse[]>(fetchBalanceRequest, 'Get Newer Balance').then(response => {
      expect(response.status).to.be.equal(200)

      const [balance] = response.body.filter(balance => balance.conta === 'Conta para saldo')

      expect(balance.saldo).to.be.equal('3084.00')
    })
  })

  it('Should remove a transaction', () => {
    cy.getTransactionByName('Movimentacao para exclusao').then(transaction => {
      const removeTransactionRequest: RequestOptions = {
        url: `/transacoes/${transaction.id}`,
        method: 'DELETE',
      }

      cy.api(removeTransactionRequest, 'Remove Transaction').its('status').should('be.equal', 204)
    })
  })
})