import { mocked } from 'ts-jest/utils'
import { mock, MockProxy } from 'jest-mock-extended'

import { AuthenticationError } from '@core/errors'
import { AccessToken, FacebookAccount } from '@core/models'
import { TokenGenerator } from '@core/protocols/cryptography'
import { LoadFacebookUser } from '@core/protocols/gateways'
import { FacebookAuthenticationService, setupFacebookAuthentication } from '@core/usecases'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@core/protocols/repositories'

jest.mock('@core/models/facebook-account')

describe('facebook-authentication usecase', () => {
  let sut: FacebookAuthenticationService
  let tokenCryptography: MockProxy<TokenGenerator>
  let facebookGateway: MockProxy<LoadFacebookUser>
  let userAccountRepository: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let token: string

  beforeAll(() => {
    token = 'any_token'
    facebookGateway = mock()
    facebookGateway.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    userAccountRepository = mock()
    userAccountRepository.load.mockResolvedValue(undefined)
    userAccountRepository.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })
    tokenCryptography = mock()
    tokenCryptography.generate.mockResolvedValue('any_generated_token')
  })

  beforeEach(() => {
    sut = setupFacebookAuthentication(
      facebookGateway,
      userAccountRepository,
      tokenCryptography
    )
  })

  test('should call LoadFacebookUser with correct args', async () => {
    await sut({ token: 'any_token' })

    expect(facebookGateway.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookGateway.loadUser).toHaveBeenCalledTimes(1)
  })

  test('should throw AuthenticationError when LoadFacebookUser returns undefined', async () => {
    facebookGateway.loadUser.mockResolvedValueOnce(undefined)
    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new AuthenticationError())
  })

  test('should call LoadUserAccountRepository when LoadFacebookUser returns core', async () => {
    await sut({ token })

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  test('should call SaveFaceboookAccount with FacebookAccount', async () => {
    await sut({ token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith(mocked(FacebookAccount).mock.instances[0])
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  test('should call TokenGenerator with correct args', async () => {
    await sut({ token })

    expect(tokenCryptography.generate).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(tokenCryptography.generate).toHaveBeenCalledTimes(1)
  })

  test('should return an AccessToken on success', async () => {
    const authResult = await sut({ token })

    expect(authResult).toEqual({ accessToken: 'any_generated_token' })
  })

  test('should rethrow if LoadFacebookUser throws', async () => {
    facebookGateway.loadUser.mockRejectedValueOnce(new Error('fb_error'))
    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  test('should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('load_error'))
    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  test('should rethrow if SaveFacebookAccount throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))
    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  test('should rethrow if TokenGenerator throws', async () => {
    tokenCryptography.generate.mockRejectedValueOnce(new Error('token_error'))
    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
