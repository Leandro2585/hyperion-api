import { getConnection, getRepository, Repository } from 'typeorm'
import { IBackup, IMemoryDb, newDb } from 'pg-mem'

import { PostgresUser } from '@infra/postgres/entities'
import { PostgresUserAccountRepository } from '@infra/postgres/repositories'

const makeFakeDatabase = async (entities?: any[]): Promise<IMemoryDb> => {
  const database = newDb()
  const connection = await database.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts']
  })
  await connection.synchronize()
  return database
}

describe('user-account repository', () => {
  describe('load', () => {
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
})
