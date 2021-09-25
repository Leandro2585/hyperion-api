import { setupAuthorize } from '@core/usecases'
import { AuthenticationMiddleware } from '@app/middlewares'
import { makeJwtTokenFactory } from '@main/factories/cryptography'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const authorize = setupAuthorize(makeJwtTokenFactory())
  return new AuthenticationMiddleware(authorize)
}
