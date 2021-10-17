import { RequiredFieldError } from '@app/errors'
import { badRequest } from '@app/helpers/http-helpers'
import { HttpResponse } from '@app/protocols'

type HttpRequest = { file: any }
type Model = Error

export class SaveAvatarController {
  async handle({ file}: HttpRequest): Promise<HttpResponse<Model>> {
    return badRequest(new RequiredFieldError('file'))
  }
}

describe('save-avatar controller', () => {
  test('should return 400 if file is not provided', async () => {
    const sut = new SaveAvatarController()
    const httpResponse = await sut.handle({ file: undefined })
    
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })
})