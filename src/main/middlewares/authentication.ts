import { adaptExpressMiddleware } from '@main/adapters/express'
import { makeAuthenticationMiddleware } from '@main/factories/middlewares'

export const auth = adaptExpressMiddleware(makeAuthenticationMiddleware())
