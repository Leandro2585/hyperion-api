import { FacebookAuthenticationService } from '@domain/usecases'
import { makeFacebookApiFactory } from '@main/factories/apis'
import { makeJwtTokenGeneratorFactory } from '@main/factories/cryptography'
import { makePgUserAccountRepositoryFactory } from '@main/factories/repositories'

export const makeFacebookAuthenticationFactory = (): FacebookAuthenticationService => {
  return new FacebookAuthenticationService(
    makeFacebookApiFactory(),
    makePgUserAccountRepositoryFactory(),
    makeJwtTokenGeneratorFactory()
  )
}
