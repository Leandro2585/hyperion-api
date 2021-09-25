import request from 'supertest'
import { sign } from 'jsonwebtoken'

import { app, env } from '@main/config'
import { auth } from '@main/middlewares'
import { ForbiddenError } from '@app/errors'

describe('authentication middleware', () => {
  test('should return 403 if authorization header was not provided', async () => {
    app.get('/fake_route', auth)
    const { status, body } = await request(app).get('/fake_route')

    expect(status).toBe(403)
    expect(body.error).toBe(new ForbiddenError().message)
  })

  test('should return 200 if authorization is valid', async () => {
    const authorization = sign({ key: 'any_user_id' }, env.jwtSecret)
    app.get('/fake_route', auth, (req, res) => {
      res.json(req.locals)
    })
    const { status, body } = await request(app)
      .get('/fake_route')
      .set({ authorization })

    expect(status).toBe(200)
    expect(body).toEqual({ userId: 'any_user_id' })
  })
})
