import { MaxFileSizeError } from '@app/errors'
import { MaxFileSizeValidator } from '@app/validators'

describe('max-file-size validator', () => {
  test('should return InvalidMimeTypeError if value is invalid', () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))
    const sut = new MaxFileSizeValidator(5, invalidBuffer)
    const error = sut.validate()

    expect(error).toEqual(new MaxFileSizeError(5))
  })

  test('should return undefined if value is valid', () => {
    const validBuffer = Buffer.from(new ArrayBuffer(4 * 1024 * 1024)) 
    const sut = new MaxFileSizeValidator(5, validBuffer)
    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  test('should return undefined if value is valid', () => {
    const validBuffer = Buffer.from(new ArrayBuffer(5 * 1024 * 1024)) 
    const sut = new MaxFileSizeValidator(5, validBuffer)
    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})