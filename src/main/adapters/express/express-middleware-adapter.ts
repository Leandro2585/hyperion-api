import { RequestHandler } from 'express'
import { Middleware } from '@app/protocols/middleware'

type Adapter = (middleware: Middleware) => RequestHandler

export const adaptExpressMiddleware: Adapter = (middleware) => async (request, response, next) => {
  const { statusCode, data } = await middleware.handle({ ...request.headers })
  if (statusCode === 200) {
    const entries = Object.entries(data).filter(entry => entry[1])
    request.locals = { ...request.locals, ...Object.fromEntries(entries) }
    next()
  } else {
    response.status(statusCode).json({ error: data.message })
  }
}
