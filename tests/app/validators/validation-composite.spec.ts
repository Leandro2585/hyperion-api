import { mock } from 'jest-mock-extended'

class ValidationComposite {
  constructor (private readonly validators: Validator[]) {}
  validate (): undefined {
    return undefined
  }
}

interface Validator {
  validate: () => Error | undefined
}

describe('validation-composite validator', () => {
  test('should return undefined if all validators return undefined', () => {
    const validator1 = mock<Validator>()
    validator1.validate.mockReturnValue(undefined)
    const validator2 = mock<Validator>()
    validator2.validate.mockReturnValue(undefined)
    const validators = [validator1, validator2]
    const sut = new ValidationComposite(validators)
    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
