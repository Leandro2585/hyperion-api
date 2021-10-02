import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@core/protocols/repositories'
import { LoadFacebookUser as LoadFacebookUserGateway } from '@core/protocols/gateways'
import { AuthenticationError } from '@core/errors'
import { AccessToken, FacebookAccount } from '@core/models'
import { TokenGenerator } from '@core/protocols/cryptography'

type Setup = (facebookGateway: LoadFacebookUserGateway, userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository, tokenCriptography: TokenGenerator) => FacebookAuthenticationService
type Input = { token: string }
type Output = { accessToken: string }

export type FacebookAuthenticationService = (input: Input) => Promise<Output>

export const setupFacebookAuthentication: Setup = (facebookGateway, userAccountRepository, tokenCriptography) => async (input) => {
  const facebookData = await facebookGateway.loadUser(input)
  if (facebookData !== undefined) {
    const accountData = await userAccountRepository.load({ email: facebookData.email })
    const facebookAccount = new FacebookAccount(facebookData, accountData)
    const { id } = await userAccountRepository.saveWithFacebook(facebookAccount)
    const accessToken = await tokenCriptography.generate({ key: id, expirationInMs: AccessToken.expirationInMs })
    return { accessToken }
  }
  throw new AuthenticationError()
}
