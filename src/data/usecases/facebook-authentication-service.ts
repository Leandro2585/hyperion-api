import { CreateFacebookAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from '@data/protocols/repositories'
import { LoadFacebookUserApi } from '@data/protocols/apis'
import { AuthenticationError } from '@domain/errors'
import { FacebookAuthentication } from '@domain/features'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & UpdateFacebookAccountRepository & CreateFacebookAccountRepository
  ) {}

  async execute (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser(params)
    if (facebookData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: facebookData.email })
      if (accountData !== undefined) {
        await this.userAccountRepository.updateWithFacebook({
          id: accountData.id,
          name: accountData.name ?? facebookData.name,
          facebookId: facebookData.facebookId
        })
      } else {
        await this.userAccountRepository.createFromFacebook(facebookData)
      }
    }
    return new AuthenticationError()
  }
}
