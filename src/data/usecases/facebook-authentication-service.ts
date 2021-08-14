import { LoadFacebookUserApi } from '@data/protocols/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@data/protocols/repositories'
import { AuthenticationError } from '@domain/errors'
import { FacebookAuthentication } from '@domain/features'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly createFacebookAccountRepository: CreateFacebookAccountRepository
  ) {}

  async execute (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.loadFacebookUserByTokenApi.loadUser(params)
    if (facebookData !== undefined) {
      await this.loadUserAccountRepository.load({ email: facebookData.email })
      await this.createFacebookAccountRepository.createFromFacebook(facebookData)
    }
    return new AuthenticationError()
  }
}
