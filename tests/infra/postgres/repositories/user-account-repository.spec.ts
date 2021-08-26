import { newDb } from 'pg-mem'

import { ILoadUserAccountRepository } from '@data/protocols/repositories'
import { Entity, PrimaryGeneratedColumn, Column, getRepository } from 'typeorm'

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
    test('should return an account if email exists', async () => {
      const database = newDb()
      const connection = await database.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PostgresUser]
      })
      await connection.synchronize()
      const postgresUserRepository = getRepository(PostgresUser)
      await postgresUserRepository.save({ email: 'existing_email' })
      const sut = new PostgresUserAccountRepository()
      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: '1' })
      await connection.close()
    })

    test('should return undefined if email does not exists', async () => {
      const database = newDb()
      const connection = await database.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PostgresUser]
      })
      await connection.synchronize()
      const sut = new PostgresUserAccountRepository()
      const account = await sut.load({ email: 'new_email' })

      expect(account).toBeUndefined()
    })
  })
})
