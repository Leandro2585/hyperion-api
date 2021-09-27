import { setupFacebookAuthentication, FacebookAuthenticationService } from '@core/usecases'
import { makefacebookGatewayFactory } from '@main/factories/gateways'
import { makeJwtTokenFactory } from '@main/factories/cryptography'
import { makePgUserAccountRepositoryFactory } from '@main/factories/repositories'

export const makeFacebookAuthenticationFactory = (): FacebookAuthenticationService => {
  return setupFacebookAuthentication(
    makefacebookGatewayFactory(),
    makePgUserAccountRepositoryFactory(),
    makeJwtTokenFactory()
  )
}
