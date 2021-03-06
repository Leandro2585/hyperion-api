import { AuthenticationError } from '@core/errors'
import { UnauthorizedError } from '@app/errors'
import { FacebookLoginController } from '@app/controllers'
import { RequiredStringValidator } from '@app/validators'
import { Controller } from '@app/protocols'

describe('facebook-login controller', () => {
  let sut: FacebookLoginController
  let facebookAuth: jest.Mock
  let token: string

  beforeAll(() => {
    token = 'any_token'
    facebookAuth = jest.fn()
    facebookAuth.mockResolvedValue({ accessToken: 'any_value' })
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })

  test('should extend controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  test('should build validators correclty', async () => {
    const validators = sut.buildValidators({ token })

    expect(validators).toEqual([
      new RequiredStringValidator('any_token', 'token')
    ])
  })

  test('should call FacebookAuthentication with correct args', async () => {
    await sut.handle({ token })

    expect(facebookAuth).toHaveBeenCalledWith({
      token: 'any_token'
    })
    expect(facebookAuth).toHaveBeenCalledTimes(1)
  })

  test('should return 401 if authentication fails', async () => {
    facebookAuth.mockRejectedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  test('should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })
})
