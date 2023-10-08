export const statement = {
  list: 'li[data-test=mov-row]',
  editStatement: (description: string) => `li[data-test=mov-row]:contains("${description}") a:first-of-type`,
  removeStatement: (description: string) => `li[data-test=mov-row]:contains("${description}") a:last-of-type`
}