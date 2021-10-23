import { RequiredFieldError } from '@app/errors'
import { RequiredStringValidator, RequiredValidator } from '@app/validators'

describe('required-string validator', () => {
  test('should extend required validator', () => {
    const sut = new RequiredStringValidator('')

    expect(sut).toBeInstanceOf(RequiredValidator)
  })

  test('should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredStringValidator('', 'any_field')
    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  test('should return undefined if value is not empty', () => {
    const sut = new RequiredStringValidator('any_value', 'any_field')
    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
