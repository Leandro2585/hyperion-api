import { getConnection, getRepository, Repository } from 'typeorm'
import { IBackup } from 'pg-mem'

import { PostgresUserProfileRepository } from '@infra/typeorm/repositories'
import { PostgresRepository } from '@infra/typeorm/protocols'
import { PostgresConnection } from '@infra/typeorm/helpers'
import { PostgresUser } from '@infra/typeorm/entities'
import { makeFakeDatabase } from '@tests/infra/typeorm/mocks'

describe('postgres-user-profile repository', () => {
  let postgresUserRepository: Repository<PostgresUser>
  let connection: PostgresConnection
  let backup: IBackup
  let sut: PostgresUserProfileRepository

  beforeAll(async () => {
    connection = PostgresConnection.getInstance()
    const database = await makeFakeDatabase([PostgresUser])
    backup = database.backup()
    postgresUserRepository = connection.getRepository(PostgresUser)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PostgresUserProfileRepository()
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  test('should extend postgres repository', () => {
    expect(sut).toBeInstanceOf(PostgresRepository)
  })

  describe('saveAvatar', () => {
    test('should update user profile', async () => {
      const { id } = await postgresUserRepository.save({ email: 'any_email', initials: 'any_initials' })
      await sut.saveAvatar({ id, avatarUrl: 'any_url' })
      const postgresUser = await postgresUserRepository.findOne({ id })

      expect(postgresUser).toMatchObject({ id, avatarUrl: 'any_url', initials: null })
    })
  })

  describe('load', () => {
    test('should load user profile', async () => {
      const { id } = await postgresUserRepository.save({ name: 'any_name', email: 'any_email' })
      const userProfile = await sut.load({ userId: id })

      expect(userProfile?.name).toMatchObject('any_name')
    })

    test('should load user profile', async () => {
      const { id } = await postgresUserRepository.save({ email: 'any_email' })
      const userProfile = await sut.load({ userId: id })

      expect(userProfile?.name).toBeUndefined()
    })

    test('should return undefined', async () => {
      const userProfile = await sut.load({ userId: 'invalid_id' })

      expect(userProfile).toBeUndefined()
    })
  })
})
