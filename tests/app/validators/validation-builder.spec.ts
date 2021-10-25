import { RequiredBufferValidator, RequiredStringValidator, ValidationBuilder } from '@app/validators'

describe('validation-builder', () => {
  test('should return RequiredStringValidator', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredStringValidator('any_value', 'any_name')])
  })

  test('should return RequiredBufferValidator', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder.of({ value: buffer }).required().build()
  
    expect(validators).toEqual([new RequiredBufferValidator(buffer)])
  })
})
