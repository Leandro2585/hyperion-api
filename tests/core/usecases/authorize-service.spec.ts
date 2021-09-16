import { mock, MockProxy } from 'jest-mock-extended'

import { AuthorizeService, setupAuthorize } from '@core/usecases'
import { ITokenValidator } from '@core/protocols/cryptography'

jest.mock('@core/models/facebook-account')

describe('authorize usecase', () => {
  let sut: AuthorizeService
  let crypto: MockProxy<ITokenValidator>
  let token: string

  beforeAll(() => {
    token = 'any_token'
    crypto = mock()
    crypto.validateToken.mockResolvedValue('any_value')
  })

  beforeEach(() => {
    sut = setupAuthorize(crypto)
  })

  test('should call ITokenValidator with correct params', async () => {
    await sut({ token: 'any_token' })

    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })

  test('should return the correct accessToken', async () => {
    const userId = await sut({ token })

    expect(userId).toBe('any_value')
  })
})
