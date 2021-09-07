import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@data/protocols/repositories'
import { ILoadFacebookUserApi } from '@data/protocols/gateways'
import { AuthenticationError } from '@domain/errors'
import { FacebookAuthentication } from '@domain/features'
import { AccessToken, FacebookAccount } from '@domain/models'
import { ITokenGenerator } from '@data/protocols/cryptography'

type AuthParams = FacebookAuthentication.Params
type AuthResult = FacebookAuthentication.Result

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: ILoadFacebookUserApi,
    private readonly userAccountRepository: ILoadUserAccountRepository & ISaveFacebookAccountRepository,
    private readonly criptography: ITokenGenerator
  ) {}

  async execute (params: AuthParams): Promise<AuthResult> {
    const facebookData = await this.facebookApi.loadUser(params)

    if (facebookData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: facebookData.email })

      const facebookAccount = new FacebookAccount(facebookData, accountData)

      const { id } = await this.userAccountRepository.saveWithFacebook(facebookAccount)

      const token = await this.criptography.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })

      return new AccessToken(token)
    }

    return new AuthenticationError()
  }
}
