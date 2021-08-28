import { getConnection, getRepository, Repository } from 'typeorm'
import { IBackup } from 'pg-mem'

import { PostgresUser } from '@infra/postgres/entities'
import { PostgresUserAccountRepository } from '@infra/postgres/repositories'
import { makeFakeDatabase } from '../mocks/mock-connection'

describe('user-account repository', () => {
  let backup: IBackup
  let postgresUserRepository: Repository<PostgresUser>
  let sut: PostgresUserAccountRepository

  beforeAll(async () => {
    const database = await makeFakeDatabase([PostgresUser])
    backup = database.backup()
    postgresUserRepository = getRepository(PostgresUser)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PostgresUserAccountRepository()
  })

  afterAll(async () => {
    await getConnection().close()
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
      await sut.saveWithFacebook({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })
      const postgresUser = await postgresUserRepository.findOne({ email: 'any_email' })

      expect(postgresUser?.id).toBe(1)
    })
  })
})
