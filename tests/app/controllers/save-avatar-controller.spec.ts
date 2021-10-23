import { RequiredFieldError } from '@app/errors'
import { badRequest, ok } from '@app/helpers/http-helpers'
import { HttpResponse } from '@app/protocols'
import { ChangeProfileAvatarService } from '@core/usecases'

type HttpRequest = { userId: string, file: { buffer: Buffer, mimeType: string } }
type Model = Error | { initials?: string, avatarUrl?: string }

export class SaveAvatarController {
  constructor(private readonly changeProfileAvatar: ChangeProfileAvatarService) {}

  async handle({ file, userId }: HttpRequest): Promise<HttpResponse<Model> | undefined> {
    if(file === undefined || file === null) return badRequest(new RequiredFieldError('file'))
    if(file.buffer.length === 0) return badRequest(new RequiredFieldError('file'))
    if(!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) return badRequest(new InvalidMimeTypeError(['png', 'jpeg']))
    if(file.buffer.length > 5 * 1024 * 1024) return badRequest(new MaxFileSizeError(5))
    const result = await this.changeProfileAvatar({ userId, file: file.buffer})
    return ok(result)
  }
}

export class InvalidMimeTypeError extends Error {
  constructor (allowed: string[]) {
    super(`Unsupported type. Allowed type: ${allowed.join(', ')}`)
    this.name = 'InvalidMimeTypeError'
  } 
}

export class MaxFileSizeError extends Error {
  constructor(maxSizeInMb: number) {
    super(`File upload limit is ${maxSizeInMb}`)
    this.name = 'MaxFileSizeError'
  }
}

describe('save-avatar controller', () => {
  let sut: SaveAvatarController
  let buffer: Buffer
  let mimeType: string
  let file: { buffer: Buffer, mimeType: string }
  let userId: string
  let changeProfileAvatar: jest.Mock

  beforeAll(() => {
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/jpg'
    file = { buffer, mimeType }
    userId = 'any_user_id'
    changeProfileAvatar = jest.fn().mockResolvedValue({ 
      initials: 'any_initials', 
      avatarUrl: 'any_avatar_url' 
    })
  })

  beforeEach(() => {
    sut = new SaveAvatarController(changeProfileAvatar)
  })

  test('should return 400 if file is not provided', async () => {
    const httpResponse = await sut.handle({ file: undefined as any, userId })
    
    expect(httpResponse).toEqual({ statusCode: 400, data: new RequiredFieldError('file') })
  })

  test('should return 400 if file is not provided', async () => {
    const httpResponse = await sut.handle({ file: null as any, userId  })
    
    expect(httpResponse).toEqual({ statusCode: 400, data: new RequiredFieldError('file') })
  })

  test('should return 400 if file is empty', async () => {
    const httpResponse = await sut.handle({ file: { buffer: Buffer.from(''), mimeType }, userId  })
    
    expect(httpResponse).toEqual({ statusCode: 400, data: new RequiredFieldError('file') })
  })

  test('should return 400 if file type is invalid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'invalid_mimetype' }, userId  })
    
    expect(httpResponse).toEqual({ statusCode: 400, data: new InvalidMimeTypeError(['png', 'jpeg']) })
  })

  test('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/png' }, userId  })
    
    expect(httpResponse).toEqual({ statusCode: 400, data: new InvalidMimeTypeError(['png', 'jpeg']) })
  })

  test('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpg' }, userId  })
    
    expect(httpResponse).toEqual({ statusCode: 400, data: new InvalidMimeTypeError(['png', 'jpeg']) })
  })

  test('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpeg' }, userId  })
    
    expect(httpResponse).toEqual({ statusCode: 400, data: new InvalidMimeTypeError(['png', 'jpeg']) })
  })

  test('should return 400 if file size is bigger than 5MB', async () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))
    const httpResponse = await sut.handle({ file: { buffer: invalidBuffer, mimeType }, userId  })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new MaxFileSizeError(5)
    })
  })
  
  test('should call change-profile-avatar with correct args', async () => {
    await sut.handle({ file, userId })

    expect(changeProfileAvatar).toHaveBeenCalledWith({ id: userId, file: file.buffer })
    expect(changeProfileAvatar).toHaveBeenCalledTimes(1)
  })

  test('should return 200 with valid data', async () => {
    const httpResponse = await sut.handle({ file, userId })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { initials: 'any_initials', avatarUrl: 'any_avatar_url' }
    })
  })
})