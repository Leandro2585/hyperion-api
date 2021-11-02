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
  let getConnectionManagerSpy: jest.Mock
  let createQueryRunnerSpy: jest.Mock
  let createConnectionSpy: jest.Mock
  let sut: PostgresConnection

  beforeAll(() => {
    getConnectionManagerSpy = jest.fn().mockReturnValue({
      has: jest.fn().mockReturnValue(false)
    })
    mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy)
    createQueryRunnerSpy = jest.fn()
    createConnectionSpy = jest.fn().mockResolvedValue({
      createQueryRunner: createQueryRunnerSpy
    })
    mocked(createConnection).mockImplementation(createConnectionSpy)
  })
  
  beforeEach(() => {
    sut = PostgresConnection.getInstance()
  })
  
  test('should have only one instance', () => {
    const sut2 = PostgresConnection.getInstance()
    
    expect(sut).toBe(sut2)
  })

  test('should create a new connection', async () => {
    await sut.connect()

    expect(createConnectionSpy).toHaveBeenCalledWith()
    expect(createConnectionSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
  })
})