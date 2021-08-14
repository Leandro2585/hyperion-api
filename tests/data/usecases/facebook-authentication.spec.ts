import { mock } from 'jest-mock-extended'
import { FacebookAuthenticationService } from '@data/usecases'
import { AuthenticationError } from '@domain/errors'
import { LoadFacebookUserApi } from '@data/protocols/apis'

describe('facebook-authentication usecase', () => {
  test('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = mock<LoadFacebookUserApi>()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.execute({ token: 'any_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  test('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApi = mock<LoadFacebookUserApi>()
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    const authResult = await sut.execute({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
