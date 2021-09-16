import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@core/models/facebook-account')

interface ITokenValidator {
  validateToken: (params: ITokenValidator.Params) => Promise<void>
}

export namespace ITokenValidator {
  export type Params = { token: string }
}
type Setup = (crypto: ITokenValidator) => Authorize
type Input = { token: string }
type Authorize = (params: Input) => Promise<void>
const setupAuthorize: Setup = (crypto) => async (params) => {
  await crypto.validateToken(params)
}

describe('authorize usecase', () => {
  let sut: Authorize
  let crypto: MockProxy<ITokenValidator>
  let token: string

  beforeAll(() => {
    token = 'any_token'
    crypto = mock()
  })

  beforeEach(() => {
    sut = setupAuthorize(crypto)
  })

  test('should call ITokenValidator with correct params', async () => {
    await sut({ token: 'any_token' })

    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })
})
