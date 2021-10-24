import { InvalidMimeTypeError } from '@app/errors'
import { AllowedMimeTypesValidator } from '@app/validators'

describe('allowed-mime-types validator', () => {
  test('should return InvalidMimeTypeError if value is invalid', () => {
    const sut = new AllowedMimeTypesValidator(['png'], 'image/jpg')
    const error = sut.validate()

    expect(error).toEqual(new InvalidMimeTypeError(['png']))
  })

  test('should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypesValidator(['png'], 'image/png')
    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  test('should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypesValidator(['jpg'], 'image/jpg')
    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  test('should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypesValidator(['jpg'], 'image/jpeg')
    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})