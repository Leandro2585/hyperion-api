import { AuthenticationError } from '@domain/errors'
import { FacebookAuthentication } from '@domain/features'

class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi) {}
  async execute (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookUserByTokenApi.loadUser(params)
    return new AuthenticationError()
  }
}

interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserApi.Params) => Promise<LoadFacebookUserApi.Result>
}

namespace LoadFacebookUserApi {
  export type Params = {
    token: string
  }
  export type Result = undefined
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  result = undefined
  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token
    return undefined
  }
}

describe('facebook-authentication usecase', () => {
  test('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.execute({ token: 'any_token' })
    expect(loadFacebookUserApi.token).toBe('any_token')
  })

  test('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    loadFacebookUserApi.result = undefined
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    const authResult = await sut.execute({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
