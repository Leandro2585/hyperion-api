import { setupFacebookAuthentication, FacebookAuthenticationService } from '@core/usecases'
import { makeFacebookApiFactory } from '@main/factories/apis'
import { makeJwtTokenFactory } from '@main/factories/cryptography'
import { makePgUserAccountRepositoryFactory } from '@main/factories/repositories'

export const makeFacebookAuthenticationFactory = (): FacebookAuthenticationService => {
  return setupFacebookAuthentication(
    makeFacebookApiFactory(),
    makePgUserAccountRepositoryFactory(),
    makeJwtTokenFactory()
  )
}
