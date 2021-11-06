import { mocked } from 'ts-jest/utils'
import { createConnection, getConnectionManager, getConnection, getRepository } from 'typeorm'

import { PostgresConnection, ConnectionNotFoundError, TransactionNotFoundError } from '@infra/typeorm/helpers'
import { PostgresUser } from '@infra/typeorm/entities'

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
	let releaseSpy: jest.Mock
	let startTransactionSpy: jest.Mock
	let commitTransactionSpy: jest.Mock
	let rollbackTransactionSpy: jest.Mock
	let getRepositorySpy: jest.Mock
	let getConnectionManagerSpy: jest.Mock
	let getConnectionSpy: jest.Mock
	let sut: PostgresConnection

	beforeAll(() => {
		getConnectionManagerSpy = jest.fn().mockReturnValue({
			has: jest.fn().mockReturnValue(true)
		})
		mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy)
		startTransactionSpy = jest.fn()
		releaseSpy = jest.fn()
		rollbackTransactionSpy = jest.fn()
		getRepositorySpy = jest.fn().mockReturnValue('any_repository')
		createQueryRunnerSpy = jest.fn().mockReturnValue({
			startTransaction: startTransactionSpy,
			rollbackTransaction: rollbackTransactionSpy,
			commitTransaction: commitTransactionSpy, 
			release: releaseSpy,
			manager: { getRepository: getRepositorySpy },
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
		mocked(getRepository).mockImplementation(getRepositorySpy)
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
	})

	test('should use an existing connection', async () => {
		await sut.connect()

		expect(getConnectionSpy).toHaveBeenCalledWith()
		expect(getConnectionSpy).toHaveBeenCalledTimes(1)
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
		expect(createQueryRunnerSpy).toHaveBeenCalledWith()
		expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
		await sut.disconnect()
	})

	test('should return ConnectionNotFoundError on open transaction if connection is not found', async () => {
		const promise = sut.openTransaction()

		expect(startTransactionSpy).not.toHaveBeenCalled()
		await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
	})

	test('should close transaction', async () => {
		await sut.connect()
		await sut.openTransaction()
		await sut.closeTransaction()

		expect(releaseSpy).toHaveBeenCalledWith()
		expect(releaseSpy).toHaveBeenCalledTimes(1)
		await sut.disconnect()
	})

	test('should return TransactionNotFoundError on close transaction if query runner is not found', async () => {
		const promise = sut.closeTransaction()

		expect(releaseSpy).not.toHaveBeenCalled()
		await expect(promise).rejects.toThrow(new TransactionNotFoundError())
	})

	test('should commit transaction', async () => {
		await sut.connect()
		await sut.openTransaction()
		await sut.commit()

		expect(commitTransactionSpy).toHaveBeenCalledWith()
		expect(commitTransactionSpy).toHaveBeenCalledTimes(1)
		await sut.disconnect()
	})

	test('should return TransactionNotFoundError on commit transaction if query runner is not found', async () => {
		const promise = sut.commit()

		expect(commitTransactionSpy).not.toHaveBeenCalled()
		await expect(promise).rejects.toThrow(new TransactionNotFoundError())
	})

	test('should rollback transaction', async () => {
		await sut.connect()
		await sut.openTransaction()
		await sut.rollback()

		expect(rollbackTransactionSpy).toHaveBeenCalledWith()
		expect(rollbackTransactionSpy).toHaveBeenCalledTimes(1)
		await sut.disconnect()
	})

	test('should return TransactionNotFoundError on rollback transaction if query runner is not found', async () => {
		const promise = sut.rollback()

		expect(rollbackTransactionSpy).not.toHaveBeenCalled()
		await expect(promise).rejects.toThrow(new TransactionNotFoundError())
	})

	test('should get repository from transaction', async () => {
		await sut.connect()
		await sut.openTransaction()
		const repository = sut.getRepository(PostgresUser)

		expect(getRepositorySpy).toHaveBeenCalledWith(PostgresUser)
		expect(getRepositorySpy).toHaveBeenCalledTimes(1)
		expect(repository).toBe('any_repository')
		await sut.disconnect()
	})

	test('should get repository', async () => {
		await sut.connect()
		const repository = sut.getRepository(PostgresUser)

		expect(getRepositorySpy).toHaveBeenCalledWith(PostgresUser)
		expect(getRepositorySpy).toHaveBeenCalledTimes(1)
		expect(repository).toBe('any_repository')
		await sut.disconnect()
	})

	test('should return ConnectionNotFoundError on get repository if connection is not found', async () => {
		expect(getRepositorySpy).not.toHaveBeenCalled()
		expect(() => sut.getRepository(PostgresUser)).rejects.toThrow(new ConnectionNotFoundError())
	})
})