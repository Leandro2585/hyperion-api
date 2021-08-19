import { AccessToken } from '@domain/models'

describe('access-token model', () => {
  test('should create with a value', () => {
    const sut = new AccessToken('any_value')

    expect(sut).toEqual({ value: 'any_value' })
  })

  test('should expire in 1800000 ms', () => {
    expect(AccessToken.expirationInMs).toBe(1800000)
  })
})
