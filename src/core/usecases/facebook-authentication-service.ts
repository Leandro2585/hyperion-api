import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@core/protocols/repositories'
import { ILoadFacebookUser as LoadFacebookUserGateway } from '@core/protocols/gateways'
import { AuthenticationError } from '@core/errors'
import { AccessToken, FacebookAccount } from '@core/models'
import { ITokenGenerator } from '@core/protocols/cryptography'

type Setup = (facebookGateway: LoadFacebookUserGateway, userAccountRepository: ILoadUserAccountRepository & ISaveFacebookAccountRepository, tokenCriptography: ITokenGenerator) => FacebookAuthenticationService
type Input = { token: string }
type Output = { accessToken: string }

export type FacebookAuthenticationService = (params: Input) => Promise<Output>

export const setupFacebookAuthentication: Setup = (facebookGateway, userAccountRepository, tokenCriptography) => async (params) => {
  const facebookData = await facebookGateway.loadUser(params)
  if (facebookData !== undefined) {
    const accountData = await userAccountRepository.load({ email: facebookData.email })
    const facebookAccount = new FacebookAccount(facebookData, accountData)
    const { id } = await userAccountRepository.saveWithFacebook(facebookAccount)
    const accessToken = await tokenCriptography.generate({ key: id, expirationInMs: AccessToken.expirationInMs })
    return { accessToken }
  }
  throw new AuthenticationError()
}
