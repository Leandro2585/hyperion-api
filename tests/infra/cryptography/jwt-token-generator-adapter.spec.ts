import jwt from 'jsonwebtoken'

import { TokenGenerator } from '@data/protocols/cryptography'

jest.mock('jsonwebtoken')

class JwtTokenGeneratorAdapter {
  constructor (private readonly secret: string) {}
  async generateToken (params: TokenGenerator.Params): Promise<void> {
    const expirationInSeconds = params.expirationInMs / 1000
    jwt.sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds })
  }
}

describe('jwt-token-generator adapter', () => {
  test('should call sign with correct params', async () => {
    const fakeJwt = jwt as jest.Mocked<typeof jwt>
    const sut = new JwtTokenGeneratorAdapter('any_secret')
    await sut.generateToken({ key: 'any_key', expirationInMs: 1000 })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'any_secret', { expiresIn: 1 })
  })
})
