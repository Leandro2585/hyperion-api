import { LoadFacebookUserApi } from '@data/protocols/apis'
import { FacebookAuthenticationService } from '@data/usecases'
import { AuthenticationError } from '@domain/errors'

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
