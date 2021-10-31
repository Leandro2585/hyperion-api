import request from 'supertest'
import { IBackup } from 'pg-mem'
import { sign } from 'jsonwebtoken'
import { getConnection, getRepository, Repository } from 'typeorm'

import { app, env } from '@main/config'
import { PostgresUser } from '@infra/typeorm/entities'
import { makeFakeDatabase } from '@tests/infra/typeorm/mocks'

describe('user-profile routes', () => {
  describe('DELETE /users/avatar', async () => {
    let backup: IBackup
    let postgresUserRepository: Repository<PostgresUser>

    beforeAll(async () => {
      const database = await makeFakeDatabase([PostgresUser])
      backup = database.backup()
      postgresUserRepository = getRepository(PostgresUser)
    })

    beforeEach(() => backup.restore())

    afterAll(async () => await getConnection().close())

    test('should return 403 if no authorization header is present', async () => {
      const { status } = await request(app)
        .delete('/api/users/avatar')
      
      expect(status).toBe(403)
    })

    test('should return 200 with valid data', async () => {
      const { id } = await postgresUserRepository.save({ name: 'Leandro Real', email: 'any_email' })
      const authorization = sign({ key: id }, env.jwtSecret)
      const { status, body } = await request(app)
        .delete('/api/users/avatar')
        .set({ authorization })
    
      expect(status).toBe(200)
      expect(body).toEqual({ avatarUrl: undefined, initials: 'LR' })
    })
  })
})