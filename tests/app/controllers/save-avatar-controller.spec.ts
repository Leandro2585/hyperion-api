import { RequiredFieldError } from '@app/errors'
import { badRequest } from '@app/helpers/http-helpers'
import { HttpResponse } from '@app/protocols'

type HttpRequest = { file: { buffer: Buffer, mimeType: string } }
type Model = Error

export class SaveAvatarController {
  async handle({ file }: HttpRequest): Promise<HttpResponse<Model> | undefined> {
    if(file === undefined || file === null) return badRequest(new RequiredFieldError('file'))
    if(file.buffer.length === 0) return badRequest(new RequiredFieldError('file'))
    if(!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) return badRequest(new InvalidMimeTypeError(['png', 'jpeg']))
  }
}

export class InvalidMimeTypeError extends Error {
  constructor (allowed: string[]) {
    super(`Unsupported type. Allowed type: ${allowed.join(', ')}`)
    this.name = 'InvalidMimeTypeError'
  } 
}

describe('save-avatar controller', () => {
  let sut: SaveAvatarController
  let buffer: Buffer
  let mimeType: string

  beforeAll(() => {
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/jpg'
  })

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
    const httpResponse = await sut.handle({ file: { buffer: Buffer.from(''), mimeType } })
    
    expect(httpResponse).toEqual({ statusCode: 400, data: new RequiredFieldError('file') })
  })

  test('should return 400 if file type is invalid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'invalid_mimetype' } })
    
    expect(httpResponse).toEqual({ statusCode: 400, data: new InvalidMimeTypeError(['png', 'jpeg']) })
  })

  test('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/png' } })
    
    expect(httpResponse).toEqual({ statusCode: 400, data: new InvalidMimeTypeError(['png', 'jpeg']) })
  })

  test('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpg' } })
    
    expect(httpResponse).toEqual({ statusCode: 400, data: new InvalidMimeTypeError(['png', 'jpeg']) })
  })

  test('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpeg' } })
    
    expect(httpResponse).toEqual({ statusCode: 400, data: new InvalidMimeTypeError(['png', 'jpeg']) })
  })
})