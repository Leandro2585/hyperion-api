import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@core/protocols/repositories'
import { ILoadFacebookUserApi } from '@core/protocols/gateways'
import { AuthenticationError } from '@core/errors'
import { AccessToken, FacebookAccount } from '@core/models'
import { ITokenGenerator } from '@core/protocols/cryptography'

type Setup = (facebookApi: ILoadFacebookUserApi, userAccountRepository: ILoadUserAccountRepository & ISaveFacebookAccountRepository, criptography: ITokenGenerator) => FacebookAuthenticationService
type Input = { token: string }
type Output = { accessToken: string }

export type FacebookAuthenticationService = (params: Input) => Promise<Output>

export const setupFacebookAuthentication: Setup = (facebookApi, userAccountRepository, criptography) => async (params) => {
  const facebookData = await facebookApi.loadUser(params)

  if (facebookData !== undefined) {
    const accountData = await userAccountRepository.load({ email: facebookData.email })

    const facebookAccount = new FacebookAccount(facebookData, accountData)

    const { id } = await userAccountRepository.saveWithFacebook(facebookAccount)

    const accessToken = await criptography.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })

    return { accessToken }
  }

  throw new AuthenticationError()
}
