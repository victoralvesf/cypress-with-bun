export const accounts = {
  nameInput: '[data-test="nome"]',
  saveButton: 'button[alt=Salvar]',
  editAccountWithText: (accountName: string) => `tbody tr:contains("${accountName}") a:first-of-type`,
  removeAccountWithText: (accountName: string) => `tbody tr:contains("${accountName}") a:last-of-type`,
  getAccountByName: (accountName: string) => `tbody tr:contains("${accountName}")`
}