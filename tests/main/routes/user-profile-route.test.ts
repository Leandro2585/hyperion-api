import request from 'supertest'
import { IBackup } from 'pg-mem'
import { sign } from 'jsonwebtoken'
import { getConnection, getRepository, Repository } from 'typeorm'

import { app, env } from '@main/config'
import { PostgresUser } from '@infra/typeorm/entities'
import { makeFakeDatabase } from '@tests/infra/typeorm/mocks'

describe('user-profile routes', () => {
  let backup: IBackup
  let postgresUserRepository: Repository<PostgresUser>

  beforeAll(async () => {
    const database = await makeFakeDatabase([PostgresUser])
    backup = database.backup()
    postgresUserRepository = getRepository(PostgresUser)
  })

  beforeEach(() => backup.restore())

  afterAll(async () => await getConnection().close())

  describe('DELETE /users/avatar', async () => {
    let deleteAvatarRoute: string

    beforeAll(() => deleteAvatarRoute = '/api/users/avatar')

    test('should return 403 if no authorization header is present', async () => {
      const { status } = await request(app)
        .delete(deleteAvatarRoute)
      
      expect(status).toBe(403)
    })

    test('should return 200 with valid data', async () => {
      const { id } = await postgresUserRepository.save({ name: 'Leandro Real', email: 'any_email' })
      const authorization = sign({ key: id }, env.jwtSecret)
      const { status, body } = await request(app)
        .delete(deleteAvatarRoute)
        .set({ authorization })
    
      expect(status).toBe(200)
      expect(body).toEqual({ avatarUrl: undefined, initials: 'LR' })
    })
  })

  describe('PUT /users/avatar', async () => {
    let updateAvatarRoute: string
    let uploadSpy = jest.fn()

    jest.mock('@infra/gateways/aws-s3-file-storage-adapter', () => ({
      AwsS3FileStorageAdapter: jest.fn().mockReturnValue({ upload: uploadSpy })
    }))

    beforeAll(() => updateAvatarRoute = '/api/users/avatar')

    test('should return 403 if no authorization header is not present', async () => {
      const { status } = await request(app).put(updateAvatarRoute)
      
      expect(status).toBe(403)
    })

    test('should return 200 with valid data', async () => {
      uploadSpy.mockResolvedValueOnce('any_avatar_url')
      const { id } = await postgresUserRepository.save({ email: 'any_email', name: 'any name' })
      const authorization = sign({ key: id }, env.jwtSecret)
      const { status, body } = await request(app)
        .put(updateAvatarRoute)
        .set({ authorization })
        .attach('avatar', Buffer.from('any_buffer'), { filename: 'any_filename', contentType: 'image/png'}) 
      
      expect(status).toBe(200)
      expect(body).toEqual({ avatarUrl: 'any_avatar_url', initial: undefined })
    })
  })
})