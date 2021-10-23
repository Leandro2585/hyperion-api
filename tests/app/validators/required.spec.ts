import { RequiredFieldError } from '@app/errors'
import { RequiredValidator } from '.'

describe('required validator', () => {
  test('should return RequiredFieldError if value is null', () => {
    const sut = new RequiredValidator(null as any, 'any_field')
    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  test('should return RequiredFieldError if value is undefined', () => {
    const sut = new RequiredValidator(undefined as any, 'any_field')
    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  test('should return undefined if value is not empty', () => {
    const sut = new RequiredValidator('any_value', 'any_field')
    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
