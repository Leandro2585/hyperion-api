import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@domain/protocols/repositories'
import { ILoadFacebookUserApi } from '@domain/protocols/gateways'
import { AuthenticationError } from '@domain/errors'
import { AccessToken, FacebookAccount } from '@domain/models'
import { ITokenGenerator } from '@domain/protocols/cryptography'

type Setup = (facebookApi: ILoadFacebookUserApi, userAccountRepository: ILoadUserAccountRepository & ISaveFacebookAccountRepository, criptography: ITokenGenerator) => FacebookAuthentication

export type FacebookAuthentication = (params: { token: string }) => Promise<AccessToken | AuthenticationError>

export const setupFacebookAuthentication: Setup = (facebookApi, userAccountRepository, criptography) => async (params) => {
  const facebookData = await facebookApi.loadUser(params)

  if (facebookData !== undefined) {
    const accountData = await userAccountRepository.load({ email: facebookData.email })

    const facebookAccount = new FacebookAccount(facebookData, accountData)

    const { id } = await userAccountRepository.saveWithFacebook(facebookAccount)

    const token = await criptography.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })

    return new AccessToken(token)
  }

  return new AuthenticationError()
}
