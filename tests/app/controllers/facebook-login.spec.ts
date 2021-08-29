type HttpResponse = {
  statusCode: number
  data: any
}

interface Controller {
  handle: (httpRequest: any) => Promise<HttpResponse>
}

export class FacebookLoginController implements Controller {
  async handle (request: any): Promise<HttpResponse> {
    return {
      statusCode: 400,
      data: new Error('The field token is required')
    }
  }
}

describe('facebook-login controller', () => {
  test('should return 400 if token is empty', async () => {
    const sut = new FacebookLoginController()
    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })
})
