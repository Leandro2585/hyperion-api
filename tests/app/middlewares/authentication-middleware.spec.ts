import { HttpResponse } from '@app/protocols'
import { ForbiddenError } from '@app/errors'
import { forbidden } from '@app/helpers/http-helpers'

type HttpRequest = {
  authorization: string
}

export class AuthenticationMiddleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Error>> {
    return forbidden()
  }
}

describe('authentication middleware', () => {
  test('should return 403 if authorization is empty', async () => {
    const sut = new AuthenticationMiddleware()
    const httpResponse = await sut.handle({ authorization: '' })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  test('should return 403 if authorization is null', async () => {
    const sut = new AuthenticationMiddleware()
    const httpResponse = await sut.handle({ authorization: null as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  test('should return 403 if authorization is undefined', async () => {
    const sut = new AuthenticationMiddleware()
    const httpResponse = await sut.handle({ authorization: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })
})
