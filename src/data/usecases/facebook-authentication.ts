import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@data/protocols/repositories'
import { LoadFacebookUserApi } from '@data/protocols/gateways'
import { AuthenticationError } from '@domain/errors'
import { FacebookAuthentication } from '@domain/features'
import { AccessToken, FacebookAccount } from '@domain/models'
import { TokenGenerator } from '@data/protocols/cryptography'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly criptography: TokenGenerator
  ) {}

  async execute (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
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
