import { RequiredFieldError } from '@app/errors'
import { RequiredBufferValidator, RequiredValidator } from '@app/validators'

describe('required-buffer validator', () => {
  test('should extend required validator', () => {
    const sut = new RequiredBufferValidator(Buffer.from(''))

    expect(sut).toBeInstanceOf(RequiredValidator)
  })

  test('should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredBufferValidator(Buffer.from(''))
    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError())
  })

  test('should return undefined if value is not empty', () => {
    const sut = new RequiredBufferValidator(Buffer.from('any_buffer'))
    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
