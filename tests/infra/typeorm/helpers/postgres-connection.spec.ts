import { mocked } from 'ts-jest/utils'
import { createConnection, getConnectionManager } from 'typeorm'

export class PostgresConnection {
  private static instance?: PostgresConnection
  private constructor () {}

  static getInstance (): PostgresConnection {
    if(PostgresConnection.instance === undefined) {
      PostgresConnection.instance = new PostgresConnection
    }
    return PostgresConnection.instance
  }

  async connect(): Promise<void> {
    const connection = await createConnection()
    connection.createQueryRunner()
  }
}

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnectionManager: jest.fn()
}))

describe('postgres connection', () => {
  test('should have only one instance', () => {
    const sut = PostgresConnection.getInstance()
    const sut2 = PostgresConnection.getInstance()
    
    expect(sut).toBe(sut2)
  })

  test('should create a new connection', async () => {
    const getConnectionManagerSpy = jest.fn().mockReturnValueOnce({
      has: jest.fn().mockReturnValueOnce(false)
    })
    mocked(getConnectionManager).mockImplementationOnce(getConnectionManagerSpy)
    const createQueryRunnerSpy = jest.fn()
    const createConnectionSpy = jest.fn().mockResolvedValueOnce({
      createQueryRunner: createQueryRunnerSpy
    })
    mocked(createConnection).mockImplementationOnce(createConnectionSpy)
    const sut = PostgresConnection.getInstance()
    await sut.connect()

    expect(createConnectionSpy).toHaveBeenCalledWith()
    expect(createConnectionSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
  })
})