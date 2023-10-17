import dayjs from 'dayjs'

interface Dayjs {
  (date?: dayjs.ConfigType): dayjs.Dayjs;
  (date?: dayjs.ConfigType, format?: dayjs.OptionType, strict?: boolean): dayjs.Dayjs;
  (date?: dayjs.ConfigType, format?: dayjs.OptionType, locale?: string, strict?: boolean): dayjs.Dayjs;
}

declare global {
  namespace Cypress {
    interface Cypress {
      dayjs: Dayjs;
    }

    interface Chainable {
      /**
       * Custom command to make login programatically.
       * @example cy.login()
       */
      login(): Chainable<void>
      /**
       * Custom command reset the test data.
       * @example cy.resetDB()
       */
      resetDB(): Chainable<void>
      api(options: Partial<Cypress.RequestOptions>, name?: string): Chainable<Response<any>>
      /**
       * Custom command to search for an account by name.
       * @example cy.getAccountByName('Account name').then(account => console.log(account.id))
       */
      getAccountByName(name: string): Chainable<AccountResponse>
      /**
       * Custom command to search for a transaction by name.
       * @example cy.getTransactionByName('Transaction name').then(transaction => console.log(transaction.id))
       */
      getTransactionByName(name: string): Chainable<TransactionResponse>
    }
  }
}

export type RequestOptions = Partial<Cypress.RequestOptions>

export interface AccountResponse {
  id: number
  nome: string
  usuario_id: number
  visivel: boolean
}

export interface BalanceResponse {
  conta_id: number
  conta: string
  saldo: string
}

export interface TransactionResponse {
  conta: string
  id: number
  descricao: string
  envolvido: string
  observacao: any
  tipo: string
  data_transacao: string
  data_pagamento: string
  valor: string
  status: boolean
  conta_id: number
  usuario_id: number
  transferencia_id: any
  parcelamento_id: any
}
