import { mocked } from 'ts-jest/utils'
import { mock, MockProxy } from 'jest-mock-extended'

import { AuthenticationError } from '@core/errors'
import { AccessToken, FacebookAccount } from '@core/models'
import { ITokenGenerator } from '@core/protocols/cryptography'
import { ILoadFacebookUser } from '@core/protocols/gateways'
import { FacebookAuthenticationService, setupFacebookAuthentication } from '@core/usecases'
import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@core/protocols/repositories'

jest.mock('@core/models/facebook-account')

describe('facebook-authentication usecase', () => {
  let sut: FacebookAuthenticationService
  let tokenCryptography: MockProxy<ITokenGenerator>
  let facebookGateway: MockProxy<ILoadFacebookUser>
  let userAccountRepository: MockProxy<ILoadUserAccountRepository & ISaveFacebookAccountRepository>
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

  test('should call ILoadFacebookUser with correct params', async () => {
    await sut({ token: 'any_token' })

    expect(facebookGateway.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookGateway.loadUser).toHaveBeenCalledTimes(1)
  })

  test('should throw AuthenticationError when ILoadFacebookUser returns undefined', async () => {
    facebookGateway.loadUser.mockResolvedValueOnce(undefined)
    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new AuthenticationError())
  })

  test('should call ILoadUserAccountRepository when ILoadFacebookUser returns core', async () => {
    await sut({ token })

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  test('should call SaveFaceboookAccountRepository with FacebookAccount', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub)
    await sut({ token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  test('should call ITokenGenerator with correct params', async () => {
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

  test('should rethrow if ILoadFacebookUser throws', async () => {
    facebookGateway.loadUser.mockRejectedValueOnce(new Error('fb_error'))
    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  test('should rethrow if ILoadUserAccountRepository throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('load_error'))
    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  test('should rethrow if ISaveFacebookAccountRepository throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))
    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  test('should rethrow if ITokenGenerator throws', async () => {
    tokenCryptography.generate.mockRejectedValueOnce(new Error('token_error'))
    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
