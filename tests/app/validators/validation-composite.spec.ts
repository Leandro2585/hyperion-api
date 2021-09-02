import { mock, MockProxy } from 'jest-mock-extended'

class ValidationComposite implements Validator {
  constructor (private readonly validators: Validator[]) {}
  validate (): Error | undefined {
    for (const validator of this.validators) {
      const error = validator.validate()
      if (error !== undefined) {
        return error
      }
    }
  }
}

interface Validator {
  validate: () => Error | undefined
}

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
    validator1.validate.mockReturnValue(new Error('error_1'))
    validator2.validate.mockReturnValue(new Error('error_2'))
    const error = sut.validate()

    expect(error).toEqual(new Error('error_1'))
  })
})
