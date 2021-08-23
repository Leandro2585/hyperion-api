import jwt from 'jsonwebtoken'

import { TokenGenerator } from '@data/protocols/cryptography'

jest.mock('jsonwebtoken')

class JwtTokenGeneratorAdapter {
  constructor (private readonly secret: string) {}
  async generateToken (params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = params.expirationInMs / 1000
    return jwt.sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds })
  }
}

describe('jwt-token-generator adapter', () => {
  let sut: JwtTokenGeneratorAdapter
  let fakeJwt: jest.Mocked<typeof jwt>

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    fakeJwt.sign.mockImplementation(() => 'any_token')
  })
  beforeEach(() => {
    sut = new JwtTokenGeneratorAdapter('any_secret')
  })

  test('should call sign with correct params', async () => {
    await sut.generateToken({ key: 'any_key', expirationInMs: 1000 })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'any_secret', { expiresIn: 1 })
  })

  test('should return a token', async () => {
    const token = await sut.generateToken({ key: 'any_key', expirationInMs: 1000 })

    expect(token).toBe('any_token')
  })

  test('should rethrow if sign throws', async () => {

  })
})
