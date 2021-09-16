import { mocked } from 'ts-jest/utils'
import { mock, MockProxy } from 'jest-mock-extended'

import { AuthenticationError } from '@domain/errors'
import { AccessToken, FacebookAccount } from '@domain/models'
import { ITokenGenerator } from '@domain/protocols/cryptography'
import { ILoadFacebookUserApi } from '@domain/protocols/gateways'
import { FacebookAuthentication, setupFacebookAuthentication } from '@domain/usecases'
import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@domain/protocols/repositories'

jest.mock('@domain/models/facebook-account')

describe('facebook-authentication usecase', () => {
  let sut: FacebookAuthentication
  let crypto: MockProxy<ITokenGenerator>
  let facebookApi: MockProxy<ILoadFacebookUserApi>
  let userAccountRepository: MockProxy<ILoadUserAccountRepository & ISaveFacebookAccountRepository>
  let token: string

  beforeAll(() => {
    token = 'any_token'
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    userAccountRepository = mock()
    userAccountRepository.load.mockResolvedValue(undefined)
    userAccountRepository.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })
    crypto = mock()
    crypto.generateToken.mockResolvedValue('any_generated_token')
  })

  beforeEach(() => {
    sut = setupFacebookAuthentication(
      facebookApi,
      userAccountRepository,
      crypto
    )
  })

  test('should call ILoadFacebookUserApi with correct params', async () => {
    await sut({ token: 'any_token' })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  test('should throw AuthenticationError when ILoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)
    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new AuthenticationError())
  })

  test('should call ILoadUserAccountRepository when ILoadFacebookUserApi returns domain', async () => {
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

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  test('should return an AccessToken on success', async () => {
    const authResult = await sut({ token })

    expect(authResult).toEqual({ accessToken: 'any_generated_token' })
  })

  test('should rethrow if ILoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))
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
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'))
    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
