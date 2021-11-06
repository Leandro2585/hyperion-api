import request from 'supertest'
import { IBackup } from 'pg-mem'

import { app } from '@main/config'
import { UnauthorizedError } from '@app/errors'
import { PostgresUser } from '@infra/typeorm/entities'
import { PostgresConnection } from '@infra/typeorm/helpers'
import { makeFakeDatabase } from '@tests/infra/typeorm/mocks'

describe('login route', () => {
  describe('POST /login/facebook', () => {
    let backup: IBackup
    let connection: PostgresConnection
    const loadUserSpy = jest.fn()

    jest.mock('@infra/gateways/facebook-gateway-adapter', () => ({
      facebookGateway: jest.fn().mockReturnValue({
        loadUser: loadUserSpy
      })
    }))

    beforeAll(async () => {
      connection = PostgresConnection.getInstance()
      const database = await makeFakeDatabase([PostgresUser])
      backup = database.backup()
    })

    beforeEach(() => {
      backup.restore()
    })

    afterAll(async () => {
      await connection.disconnect()
    })

    test('should return 200 with AccessToken', async () => {
      loadUserSpy.mockResolvedValueOnce({
        facebookId: 'any_id',
        name: 'any_name',
        email: 'any_email'
      })
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })

      expect(status).toBe(200)
      expect(body.accessToken).toBeDefined()
    })

    test('should return 401 with UnauthorizedError', async () => {
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'invalid_token' })

      expect(status).toBe(401)
      expect(body.error).toBe(new UnauthorizedError().message)
    })
  })
})
