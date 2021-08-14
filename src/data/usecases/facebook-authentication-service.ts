import { LoadFacebookUserApi } from '@data/protocols/apis'
import { AuthenticationError } from '@domain/errors'
import { FacebookAuthentication } from '@domain/features'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi) {}
  async execute (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookUserByTokenApi.loadUser(params)
    return new AuthenticationError()
  }
}
