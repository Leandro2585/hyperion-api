import { mock } from 'jest-mock-extended'

import { FacebookAuthentication } from '@domain/features'

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
    await this.facebookAuthentication.execute({ token: httpRequest.token })
    return {
      statusCode: 400,
      data: new Error('The field token is required')
    }
  }
}

describe('facebook-login controller', () => {
  test('should return 400 if token is empty', async () => {
    const facebookAuth = mock<FacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuth)
    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  test('should return 400 if token is null', async () => {
    const facebookAuth = mock<FacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuth)
    const httpResponse = await sut.handle({ token: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  test('should return 400 if token is undefined', async () => {
    const facebookAuth = mock<FacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuth)
    const httpResponse = await sut.handle({ token: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  test('should call FacebookAuthentication with correct params', async () => {
    const facebookAuth = mock<FacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuth)
    await sut.handle({ token: 'any_token' })

    expect(facebookAuth.execute).toHaveBeenCalledWith({
      token: 'any_token'
    })
    expect(facebookAuth.execute).toHaveBeenCalledTimes(1)
  })
})
