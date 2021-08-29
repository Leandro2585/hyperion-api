import { mock, MockProxy } from 'jest-mock-extended'

import { FacebookAuthentication } from '@domain/features'
import { AuthenticationError } from '@domain/errors'

type HttpResponse = {
  statusCode: number
  data: any
}

interface Controller {
  handle: (httpRequest: any) => Promise<HttpResponse>
}

export class FacebookLoginController implements Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
      return {
        statusCode: 400,
        data: new Error('The field token is required')
      }
    }
    const result = await this.facebookAuthentication.execute({ token: httpRequest.token })
    return {
      statusCode: 401,
      data: result
    }
  }
}

describe('facebook-login controller', () => {
  let sut: FacebookLoginController
  let facebookAuth: MockProxy<FacebookAuthentication>

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })

  beforeAll(() => {
    facebookAuth = mock()
  })

  test('should return 400 if token is empty', async () => {
    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  test('should return 400 if token is null', async () => {
    const httpResponse = await sut.handle({ token: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  test('should return 400 if token is undefined', async () => {
    const httpResponse = await sut.handle({ token: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  test('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token: 'any_token' })

    expect(facebookAuth.execute).toHaveBeenCalledWith({
      token: 'any_token'
    })
    expect(facebookAuth.execute).toHaveBeenCalledTimes(1)
  })

  test('should return 401 if authentication fails', async () => {
    facebookAuth.execute.mockResolvedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new AuthenticationError()
    })
  })
})
