import { InvalidMimeTypeError } from '@app/errors'

type AllowedExtensions = 'png' | 'jpg'

export class AllowedMimeTypesValidator {
  constructor(
    private readonly allowedExtensions: AllowedExtensions[], 
    private readonly mimeType: string
  ) {}

  validate(): Error | undefined {
    let isValid = false
    if(this.isPng()) isValid = true
    else if(this.isJpg()) isValid = true
    if(!isValid) return new InvalidMimeTypeError(this.allowedExtensions)
  }

  private isPng (): Boolean {
    return this.allowedExtensions.includes('png') && this.mimeType === 'image/png'
  }

  private isJpg(): Boolean {
    return this.allowedExtensions.includes('jpg') && /image\/jpe?g/.test(this.mimeType)
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