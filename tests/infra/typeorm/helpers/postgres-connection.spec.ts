import { mocked } from 'ts-jest/utils'
import { createConnection, getConnectionManager, getConnection } from 'typeorm'

import { PostgresConnection, ConnectionNotFoundError } from '@infra/typeorm/helpers'

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnection: jest.fn(),
  getConnectionManager: jest.fn()
}))

describe('postgres connection', () => {
  let createQueryRunnerSpy: jest.Mock
  let createConnectionSpy: jest.Mock
  let closeSpy: jest.Mock
  let startTransactionSpy: jest.Mock
  let getConnectionManagerSpy: jest.Mock
  let getConnectionSpy: jest.Mock
  let sut: PostgresConnection

  beforeAll(() => {
    getConnectionManagerSpy = jest.fn().mockReturnValue({
      has: jest.fn().mockReturnValue(true)
    })
    mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy)
    startTransactionSpy = jest.fn()
    createQueryRunnerSpy = jest.fn().mockReturnValue({
      startTransaction: startTransactionSpy
    })
    createConnectionSpy = jest.fn().mockResolvedValue({
      createQueryRunner: createQueryRunnerSpy
    })
    closeSpy = jest.fn()
    mocked(createConnection).mockImplementation(createConnectionSpy)
    getConnectionSpy = jest.fn().mockReturnValue({
      createQueryRunner: createQueryRunnerSpy,
      close: closeSpy
    })
    mocked(getConnection).mockImplementation(getConnectionSpy)
  })
  
  beforeEach(() => sut = PostgresConnection.getInstance())

  test('should have only one instance', () => {
    const sut2 = PostgresConnection.getInstance()
    
    expect(sut).toBe(sut2)
  })

  test('should create a new connection', async () => {
    getConnectionManagerSpy.mockReturnValue({ has: jest.fn().mockReturnValue(false) })
    await sut.connect()

    expect(createConnectionSpy).toHaveBeenCalledWith()
    expect(createConnectionSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
  })

  test('should use an existing connection', async () => {
    await sut.connect()

    expect(getConnectionSpy).toHaveBeenCalledWith()
    expect(getConnectionSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
  })

  test('should close connection', async () => {
    await sut.connect()
    await sut.disconnect()

    expect(closeSpy).toHaveBeenCalledWith()
    expect(closeSpy).toHaveBeenCalledWith(1)
  })

  test('should return ConnectionNotFoundError on disconnect if connection is not found', async () => {
    const promise = sut.disconnect()

    expect(closeSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })

  test('should open transaction', async () => {
    await sut.connect()
    await sut.openTransaction()

    expect(startTransactionSpy).toHaveBeenCalledWith()
    expect(startTransactionSpy).toHaveBeenCalledTimes(1)
    await sut.disconnect()
  })

  test('should return ConnectionNotFoundError on open transaction if connection is not found', async () => {
    const promise = sut.openTransaction()

    expect(startTransactionSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })
})