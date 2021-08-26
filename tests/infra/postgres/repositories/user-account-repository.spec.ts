import { IBackup, newDb } from 'pg-mem'

import { ILoadUserAccountRepository } from '@data/protocols/repositories'
import { Entity, PrimaryGeneratedColumn, Column, getRepository, Repository, getConnection } from 'typeorm'

export class PostgresUserAccountRepository implements ILoadUserAccountRepository {
  async load (params: ILoadUserAccountRepository.Params): Promise<ILoadUserAccountRepository.Result> {
    const postgresUserRepository = getRepository(PostgresUser)
    const postgresUser = await postgresUserRepository.findOne({ email: params.email })
    if (postgresUser !== undefined) {
      return {
        id: postgresUser.id.toString(),
        name: postgresUser.name ?? undefined
      }
    }
  }
}

@Entity({ name: 'users' })
class PostgresUser {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'name', nullable: true })
  name?: string

  @Column()
  email!: string

  @Column({ name: 'id_facebook', nullable: true })
  facebookId?: string
}

describe('user-account repository', () => {
  describe('load', () => {
    let backup: IBackup
    let postgresUserRepository: Repository<PostgresUser>
    let sut: PostgresUserAccountRepository

    beforeAll(async () => {
      const database = newDb()
      const connection = await database.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PostgresUser]
      })
      await connection.synchronize()
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
