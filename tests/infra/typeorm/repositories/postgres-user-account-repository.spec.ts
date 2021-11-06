import { getConnection, getRepository, Repository } from 'typeorm'
import { IBackup } from 'pg-mem'

import { PostgresUser } from '@infra/typeorm/entities'
import { PostgresConnection } from '@infra/typeorm/helpers'
import { PostgresRepository } from '@infra/typeorm/protocols'
import { PostgresUserAccountRepository } from '@infra/typeorm/repositories'
import { makeFakeDatabase } from '@tests/infra/typeorm/mocks'

describe('postgres-user-account repository', () => {
  let postgresUserRepository: Repository<PostgresUser>
  let connection: PostgresConnection
  let backup: IBackup
  let sut: PostgresUserAccountRepository

  beforeAll(async () => {
    connection = PostgresConnection.getInstance()
    const database = await makeFakeDatabase([PostgresUser])
    backup = database.backup()
    postgresUserRepository = connection.getRepository(PostgresUser)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PostgresUserAccountRepository()
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  test('should extend postgres repository', () => {
    expect(sut).toBeInstanceOf(PostgresRepository)
  })

  describe('load', () => {
    test('should return an account if email exists', async () => {
      await postgresUserRepository.save({ email: 'existing_email' })
      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: '1' })
    })

    test('should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: 'new_email' })

      expect(account).toBeUndefined()
    })
  })

  describe('saveWithFacebook', () => {
    test('should create an account if id is undefined', async () => {
      const { id } = await sut.saveWithFacebook({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })
      const postgresUser = await postgresUserRepository.findOne({ email: 'any_email' })

      expect(postgresUser?.id).toBe(1)
      expect(id).toBe('1')
    })

    test('should update an account if id is defined', async () => {
      await postgresUserRepository.save({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })
      const { id } = await sut.saveWithFacebook({
        id: '1',
        name: 'new_name',
        email: 'new_email',
        facebookId: 'new_fb_id'
      })
      const postgresUser = await postgresUserRepository.findOne({ id: '1' })

      expect(postgresUser).toMatchObject({
        id: 1,
        email: 'any_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })
      expect(id).toBe('1')
    })
  })
})
