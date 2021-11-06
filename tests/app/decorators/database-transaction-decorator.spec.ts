import { mock } from 'jest-mock-extended'

export class DatabaseTransactionDecorator {
  constructor (private readonly database: DatabaseTransaction) {}
  async execute(httpRequest: any): Promise<void> {
    await this.database.openTransaction()
  }
}

export interface DatabaseTransaction {
  openTransaction: () => Promise<void>
}

describe('database-transaction decorator', () => {
  test('should open transaction', async () => {
    const database = mock<DatabaseTransaction>()
    const sut = new DatabaseTransactionDecorator(database)
    await sut.execute({ any: 'any' })

    expect(database.openTransaction).toHaveBeenCalledWith()
    expect(database.openTransaction).toHaveBeenCalledTimes(1)
  })
})