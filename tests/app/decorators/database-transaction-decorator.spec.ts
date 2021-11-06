import { mock, MockProxy } from 'jest-mock-extended'

import { Controller } from '@app/protocols'

export class DatabaseTransactionDecorator {
  constructor (
    private readonly decoratee: Controller, 
    private readonly database: DatabaseTransaction
  ) {}
  
  async execute(httpRequest: any): Promise<void> {
    await this.database.openTransaction()
    await this.decoratee.execute(httpRequest)
  }
}

export interface DatabaseTransaction {
  openTransaction: () => Promise<void>
}

describe('database-transaction decorator', () => {
  let database: MockProxy<DatabaseTransaction>
  let decoratee: MockProxy<Controller>
  let sut: DatabaseTransactionDecorator

  beforeAll(() => {
    database = mock()
    decoratee = mock()
  })
  
  beforeEach(() => {
    sut = new DatabaseTransactionDecorator(decoratee, database)
  })

  test('should open transaction', async () => {
    await sut.execute({ any: 'any' })

    expect(database.openTransaction).toHaveBeenCalledWith()
    expect(database.openTransaction).toHaveBeenCalledTimes(1)
  })

  test('should execute decoratee', async () => {
    await sut.execute({ any: 'any' })

    expect(decoratee.execute).toHaveBeenCalledWith({ any: 'any' })
    expect(decoratee.execute).toHaveBeenCalledTimes(1)
  })
})