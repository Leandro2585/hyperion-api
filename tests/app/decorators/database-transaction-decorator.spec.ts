import { mock, MockProxy } from 'jest-mock-extended'

import { Controller, DatabaseTransaction } from '@app/protocols'
import { DatabaseTransactionDecorator } from '@app/decorators'

describe('database-transaction decorator', () => {
  let database: MockProxy<DatabaseTransaction>
  let decoratee: MockProxy<Controller>
  let sut: DatabaseTransactionDecorator

  beforeAll(() => {
    database = mock()
    decoratee = mock()
    decoratee.execute.mockResolvedValue({ statusCode: 204, data: null })
  })
  
  beforeEach(() => {
    sut = new DatabaseTransactionDecorator(decoratee, database)
  })

  test('should extend controller', () => {
    expect(sut).toBeInstanceOf(Controller)
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
    sut.execute({ any: 'any' }).catch(() => {
      expect(database.commit).not.toHaveBeenCalled()
      expect(database.rollback).toHaveBeenCalledWith()
      expect(database.rollback).toHaveBeenCalledTimes(1)
      expect(database.closeTransaction).toHaveBeenCalledWith()
      expect(database.closeTransaction).toHaveBeenCalledTimes(1)
    })
  })

  test('should return same result as decoratee on success', async () => {
    const httpResponse = await sut.execute({ any: 'any' })
    
    expect(httpResponse).toEqual({ statusCode: 204, data: null })
  })

  test('should rethrow if decoratee throws', async () => {
    const error = new Error('decoratee_error')
    decoratee.execute.mockRejectedValueOnce(error)
    const promise = sut.execute({ any: 'any' })

    await expect(promise).rejects.toThrow(error)
  })
})