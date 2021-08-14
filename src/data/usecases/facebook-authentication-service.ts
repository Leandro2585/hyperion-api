import { LoadFacebookUserApi } from '@data/protocols/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@data/protocols/repositories'
import { AuthenticationError } from '@domain/errors'
import { FacebookAuthentication } from '@domain/features'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & CreateFacebookAccountRepository
  ) {}

  async execute (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser(params)
    if (facebookData !== undefined) {
      await this.userAccountRepository.load({ email: facebookData.email })
      await this.userAccountRepository.createFromFacebook(facebookData)
    }
    return new AuthenticationError()
  }
}
