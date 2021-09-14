import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@domain/protocols/repositories'
import { ILoadFacebookUserApi } from '@domain/protocols/gateways'
import { AuthenticationError } from '@domain/errors'
import { FacebookAuthentication } from '@domain/features'
import { AccessToken, FacebookAccount } from '@domain/models'
import { ITokenGenerator } from '@domain/protocols/cryptography'

type AuthParams = FacebookAuthentication.Params
type AuthResult = FacebookAuthentication.Result

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: ILoadFacebookUserApi,
    private readonly userAccountRepository: ILoadUserAccountRepository & ISaveFacebookAccountRepository,
    private readonly criptography: ITokenGenerator
  ) {}

  async execute (params: AuthParams): Promise<AuthResult> {
    const facebookdomain = await this.facebookApi.loadUser(params)

    if (facebookdomain !== undefined) {
      const accountdomain = await this.userAccountRepository.load({ email: facebookdomain.email })

      const facebookAccount = new FacebookAccount(facebookdomain, accountdomain)

      const { id } = await this.userAccountRepository.saveWithFacebook(facebookAccount)

      const token = await this.criptography.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })

      return new AccessToken(token)
    }

    return new AuthenticationError()
  }
}
