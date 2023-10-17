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
       * Custom command to get JWT Token.
       * @example cy.getJwtToken().then(token => console.log(token))
       */
      getJwtToken(): Chainable<string>
      /**
       * Custom command reset the test data.
       * @example cy.resetDB()
       */
      resetDB(): Chainable<void>
      api(options: Partial<Cypress.RequestOptions>, name?: string): Chainable<Response<any>>
      getAccountByName(name: string): Chainable<AccountResponse>
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
