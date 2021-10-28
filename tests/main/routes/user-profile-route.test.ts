import { IBackup } from 'pg-mem'
import { getConnection } from 'typeorm'
import request from 'supertest'

import { app } from '@main/config'
import { PostgresUser } from '@infra/typeorm/entities'
import { makeFakeDatabase } from '@tests/infra/typeorm/mocks'

describe('user-profile routes', () => {
  describe('DELETE /users/avatar', async () => {
    let backup: IBackup

    beforeAll(async () => {
      const database = await makeFakeDatabase([PostgresUser])
      backup = database.backup()
    })

    beforeEach(() => backup.restore())

    afterAll(async () => await getConnection().close())

    test('should return 403 if no authorization header is present', async () => {
      const { status } = await request(app)
        .delete('/api/users/avatar')
      
      expect(status).toBe(403)
    })
  })
})