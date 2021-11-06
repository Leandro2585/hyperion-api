import { mock, MockProxy } from 'jest-mock-extended'

import { Controller } from '@app/protocols'

export class DatabaseTransactionDecorator {
  constructor (
    private readonly decoratee: Controller, 
    private readonly database: DatabaseTransaction
  ) {}
  
  async execute(httpRequest: any): Promise<void> {
    await this.database.openTransaction()
    try {
      await this.decoratee.execute(httpRequest)
      await this.database.commit()
    } catch {
      await this.database.rollback()
    } finally {
      await this.database.closeTransaction()
    }
  }
}

export interface DatabaseTransaction {
  commit: () => Promise<void>
  rollback: () => Promise<void>
  openTransaction: () => Promise<void>
  closeTransaction: () => Promise<void>
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

  test('should call commit and close transaction on success', async () => {
    await sut.execute({ any: 'any' })
    
    expect(database.rollback).not.toHaveBeenCalled()
    expect(database.commit).toHaveBeenCalledWith()
    expect(database.commit).toHaveBeenCalledTimes(1)
    expect(database.closeTransaction).toHaveBeenCalledWith()
    expect(database.closeTransaction).toHaveBeenCalledTimes(1)
  })

  test('should call rollback and close transaction on failure', async () => {
    decoratee.execute.mockRejectedValueOnce(new Error('decoratee_error'))
    await sut.execute({ any: 'any' })

    expect(database.commit).not.toHaveBeenCalled()
    expect(database.rollback).toHaveBeenCalledWith()
    expect(database.rollback).toHaveBeenCalledTimes(1)
    expect(database.closeTransaction).toHaveBeenCalledWith()
    expect(database.closeTransaction).toHaveBeenCalledTimes(1)
  })
})