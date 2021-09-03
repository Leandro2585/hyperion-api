import { mock, MockProxy } from 'jest-mock-extended'

import { ValidationComposite } from '@app/validators'
import { Validator } from '@app/protocols'

describe('validation-composite validator', () => {
  let sut: ValidationComposite
  let validator1: MockProxy<Validator>
  let validator2: MockProxy<Validator>
  let validators: Validator[]

  beforeEach(() => {
    validator1 = mock<Validator>()
    validator1.validate.mockReturnValue(undefined)
    validator2 = mock<Validator>()
    validator2.validate.mockReturnValue(undefined)
    validators = [validator1, validator2]
    sut = new ValidationComposite(validators)
  })

  test('should return undefined if all validators return undefined', () => {
    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  test('should return the first error', () => {
    validator1.validate.mockReturnValueOnce(new Error('error_1'))
    validator2.validate.mockReturnValueOnce(new Error('error_2'))
    const error = sut.validate()

    expect(error).toEqual(new Error('error_1'))
  })

  test('should return the error', () => {
    validator2.validate.mockReturnValueOnce(new Error('error_2'))
    const error = sut.validate()

    expect(error).toEqual(new Error('error_2'))
  })
})
