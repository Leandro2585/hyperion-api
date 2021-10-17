import { RequiredFieldError } from '@app/errors'
import { badRequest } from '@app/helpers/http-helpers'
import { HttpResponse } from '@app/protocols'

type HttpRequest = { file: { buffer: Buffer } }
type Model = Error

export class SaveAvatarController {
  async handle({ file}: HttpRequest): Promise<HttpResponse<Model>> {
    return badRequest(new RequiredFieldError('file'))
  }
}

describe('save-avatar controller', () => {
  let sut: SaveAvatarController

  beforeEach(() => {
    sut = new SaveAvatarController()
  })

  test('should return 400 if file is not provided', async () => {
    const httpResponse = await sut.handle({ file: undefined as any })
    
    expect(httpResponse).toEqual({ statusCode: 400, data: new RequiredFieldError('file') })
  })

  test('should return 400 if file is not provided', async () => {
    const httpResponse = await sut.handle({ file: null as any })
    
    expect(httpResponse).toEqual({ statusCode: 400, data: new RequiredFieldError('file') })
  })

  test('should return 400 if file is empty', async () => {
    const httpResponse = await sut.handle({ file: { buffer: Buffer.from('') } })
    
    expect(httpResponse).toEqual({ statusCode: 400, data: new RequiredFieldError('file') })
  })
})