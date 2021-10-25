import { InvalidMimeTypeError, MaxFileSizeError, RequiredFieldError } from '@app/errors'
import { SaveAvatarController } from '@app/controllers'
import { Controller } from '@app/protocols'
import { RequiredValidator, RequiredBufferValidator, AllowedMimeTypesValidator, MaxFileSizeValidator } from '@app/validators'

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

  test('should extend controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  test('should build validators correctly', async () => {
    const validators = sut.buildValidators({ file, userId })

    expect(validators).toEqual([
      new RequiredValidator(file, 'file'),
      new RequiredBufferValidator(buffer, 'file'),
      new AllowedMimeTypesValidator(['png', 'jpg'], mimeType),
      new MaxFileSizeValidator(5, buffer)
    ])
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