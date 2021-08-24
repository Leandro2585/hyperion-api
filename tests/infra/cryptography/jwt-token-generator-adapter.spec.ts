import jwt from 'jsonwebtoken'

import { JwtTokenGeneratorAdapter } from '@infra/cryptography'

jest.mock('jsonwebtoken')

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
    fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error') })
    const promise = sut.generateToken({ key: 'any_key', expirationInMs: 1000 })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
