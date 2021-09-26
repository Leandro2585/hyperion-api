import { AuthenticationMiddleware } from '@app/middlewares'
import { makeJwtTokenFactory } from '@main/factories/cryptography'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const jwt = makeJwtTokenFactory()
  return new AuthenticationMiddleware(jwt.validateToken.bind(jwt))
}
