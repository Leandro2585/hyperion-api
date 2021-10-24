import { InvalidMimeTypeError } from '@app/errors'

type AllowedExtensions = 'png' | 'jpg'

export class AllowedMimeTypesValidator {
  constructor(
    private readonly allowedExtensions: AllowedExtensions[], 
    private readonly mimeType: string
  ) {}

  validate(): Error | undefined {
    if(this.allowedExtensions.includes('png') && this.mimeType !== 'image/png') {
      return new InvalidMimeTypeError(this.allowedExtensions)
    }
  }
}

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
})