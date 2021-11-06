import { mock, MockProxy } from 'jest-mock-extended'

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
  let database: MockProxy<DatabaseTransaction>
  let sut: DatabaseTransactionDecorator

  beforeAll(() => {
    database = mock()
  })
  
  beforeEach(() => {
    sut = new DatabaseTransactionDecorator(database)
  })

  test('should open transaction', async () => {
    
    await sut.execute({ any: 'any' })

    expect(database.openTransaction).toHaveBeenCalledWith()
    expect(database.openTransaction).toHaveBeenCalledTimes(1)
  })
})