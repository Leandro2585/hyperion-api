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
