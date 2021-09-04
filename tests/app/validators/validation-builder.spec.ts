import { RequiredStringValidator } from '@app/validators'
import { ValidationBuilder } from '@app/validatos'

describe('validation-builder', () => {
  test('should return a RequiredStringValidator', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value', fieldName: 'any_name' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredStringValidator('any_value', 'any_name')])
  })
})
