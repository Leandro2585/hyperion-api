import { AccessToken } from '@domain/models'

describe('access-token model', () => {
  test('should expire in 1800000 ms', () => {
    expect(AccessToken.expirationInMs).toBe(1800000)
  })
})
