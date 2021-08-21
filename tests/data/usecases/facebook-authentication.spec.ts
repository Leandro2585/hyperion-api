import { mocked } from 'ts-jest/utils'
import { mock, MockProxy } from 'jest-mock-extended'

import { AuthenticationError } from '@domain/errors'
import { AccessToken, FacebookAccount } from '@domain/models'
import { TokenGenerator } from '@data/protocols/cryptography'
import { LoadFacebookUserApi } from '@data/protocols/gateways'
import { FacebookAuthenticationService } from '@data/usecases'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@data/protocols/repositories'

jest.mock('@domain/models/facebook-account')

describe('facebook-authentication usecase', () => {
  let sut: FacebookAuthenticationService
  let crypto: MockProxy<TokenGenerator>
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepository: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
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
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepository,
      crypto
    )
  })

  test('should call LoadFacebookUserApi with correct params', async () => {
    await sut.execute({ token: 'any_token' })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  test('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.execute({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  test('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.execute({ token })

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  test('should call SaveFaceboookAccountRepository with FacebookAccount', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub)
    await sut.execute({ token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  test('should call TokenGenerator with correct params', async () => {
    await sut.execute({ token })

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  test('should return an AccessToken on success', async () => {
    const authResult = await sut.execute({ token })

    expect(authResult).toEqual(new AccessToken('any_generated_token'))
  })

  test('should rethrow if LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))
    const promise = sut.execute({ token })

    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  test('should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('load_error'))
    const promise = sut.execute({ token })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  test('should rethrow if SaveFacebookAccountRepository throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))
    const promise = sut.execute({ token })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  test('should rethrow if TokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'))
    const promise = sut.execute({ token })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
