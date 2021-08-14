import { mock, MockProxy } from 'jest-mock-extended'
import { AuthenticationError } from '@domain/errors'
import { LoadFacebookUserApi } from '@data/protocols/apis'
import { FacebookAuthenticationService } from '@data/usecases'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@data/protocols/repositories'

describe('facebook-authentication usecase', () => {
  let sut: FacebookAuthenticationService
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>
  let createFacebookAccountRepository: MockProxy<CreateFacebookAccountRepository>

  const token = 'any_token'

  beforeEach(() => {
    loadFacebookUserApi = mock()
    loadUserAccountRepository = mock()
    createFacebookAccountRepository = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepository,
      createFacebookAccountRepository
    )
  })

  test('should call LoadFacebookUserApi with correct params', async () => {
    await sut.execute({ token: 'any_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  test('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.execute({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })

  test('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.execute({ token })
    expect(loadUserAccountRepository.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  test('should call CreateUserAccountRepository when LoadUserAccountRepository returns undefined', async () => {
    loadUserAccountRepository.load.mockResolvedValueOnce(undefined)
    await sut.execute({ token })
    expect(createFacebookAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      facebookId: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_fb_email'
    })
    expect(createFacebookAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
