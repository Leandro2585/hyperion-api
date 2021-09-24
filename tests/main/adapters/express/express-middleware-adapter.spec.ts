import { NextFunction, Request, RequestHandler, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { Middleware } from '@app/protocols/middleware'
import { mock, MockProxy } from 'jest-mock-extended'

type Adapter = (middleware: Middleware) => RequestHandler

const adaptExpressMiddleware: Adapter = (middleware) => async (request, response, next) => {
  await middleware.handle({ ...request.headers })
}

describe('express-middleware adapter', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let middleware: MockProxy<Middleware>

  beforeEach(() => {
    req = getMockReq({ headers: { any: 'any' } })
    res = getMockRes().res
    next = getMockRes().next
    middleware = mock()
    middleware.handle.mockResolvedValue({
      statusCode: 200,
      data: { any: 'any' }
    })
  })

  test('should call handle with correct request', async () => {
    const sut = adaptExpressMiddleware(middleware)
    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  test('should call handle with empty request', async () => {
    const req = getMockReq()
    const sut = adaptExpressMiddleware(middleware)
    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({})
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })
})
