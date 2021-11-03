import { mocked } from 'ts-jest/utils'
import { Connection, createConnection, getConnectionManager, getConnection, QueryRunner,  } from 'typeorm'

export class ConnectionNotFoundError extends Error {
  constructor() {
    super('No connection was found')
    this.name = 'ConnectionNotFoundError'
  }
}

export class PostgresConnection {
  private static instance?: PostgresConnection
  private query?: QueryRunner

  private constructor () {}

  static getInstance (): PostgresConnection {
    if(PostgresConnection.instance === undefined) {
      PostgresConnection.instance = new PostgresConnection
    }
    return PostgresConnection.instance
  }

  async connect(): Promise<void> {
    const connection: Connection = getConnectionManager().has('default')
      ? getConnection()
      : await createConnection()
    this.query = connection.createQueryRunner()
  }

  async disconnect(): Promise<void> {
    if (this.query === undefined) throw new ConnectionNotFoundError()
    await getConnection().close()
    this.query = undefined
  }
}

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
  let getConnectionManagerSpy: jest.Mock
  let getConnectionSpy: jest.Mock
  let sut: PostgresConnection

  beforeAll(() => {
    getConnectionManagerSpy = jest.fn().mockReturnValue({
      has: jest.fn().mockReturnValue(true)
    })
    mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy)
    createQueryRunnerSpy = jest.fn().mockReturnValue({})
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
})