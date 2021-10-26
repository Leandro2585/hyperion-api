import { AllowedMimeTypesValidator, MaxFileSizeValidator, RequiredBufferValidator, RequiredStringValidator, RequiredValidator, ValidationBuilder } from '@app/validators'

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

  test('should return RequiredValidator', () => {
    const validators = ValidationBuilder.of({ value: { any: 'any' } }).required().build()

    expect(validators).toEqual([new RequiredValidator({ any: 'any' })])
  })

  test('should return Required', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder.of({ value: { buffer } }).required().build()

    expect(validators).toEqual([
      new RequiredValidator({ buffer }), 
      new RequiredBufferValidator(buffer)
    ])
  })

  test('should return correct image validators', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder
      .of({ value: { buffer } })
      .image({ allowedExtensions: ['png'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([new MaxFileSizeValidator(6, buffer)])
  })

  test('should return correct image validators', () => {
    const validators = ValidationBuilder
      .of({ value: { mimeType: 'image/png' } })
      .image({ allowedExtensions: ['png'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([new AllowedMimeTypesValidator(['png'], 'image/png')])
  })

  test('should return correct image validators', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder
      .of({ value: { buffer, mimeType: 'image/png' } })
      .image({ allowedExtensions: ['png'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([
      new AllowedMimeTypesValidator(['png'], 'image/png'),
      new MaxFileSizeValidator(6, buffer),
    ])
  })
})
