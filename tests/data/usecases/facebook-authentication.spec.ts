import { mocked } from 'ts-jest/utils'
import { mock, MockProxy } from 'jest-mock-extended'

import { AuthenticationError } from '@domain/errors'
import { LoadFacebookUserApi } from '@data/protocols/gateways'
import { TokenGenerator } from '@data/protocols/cryptography'
import { FacebookAuthenticationService } from '@data/usecases'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@data/protocols/repositories'
import { FacebookAccount } from '@domain/models'

jest.mock('@domain/models/facebook-account')

describe('facebook-authentication usecase', () => {
  let sut: FacebookAuthenticationService
  let crypto: MockProxy<TokenGenerator>
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepository: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>

  const token = 'any_token'

  beforeEach(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    userAccountRepository = mock()
    crypto = mock()
    userAccountRepository.load.mockResolvedValue(undefined)
    userAccountRepository.saveWithFacebook.mockResolvedValueOnce({ id: 'any_account_id' })
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

    expect(crypto.generateToken).toHaveBeenCalledWith({ key: 'any_account_id' })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })
})
