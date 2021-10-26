import { Validator } from '@app/protocols'
import { RequiredStringValidator, RequiredValidator, RequiredBufferValidator, AllowedMimeTypesValidator, AllowedExtensions, MaxFileSizeValidator } from '@app/validators'

type BuilderParams = {
  value: any
  fieldName?: string
}

export class ValidationBuilder {
  private constructor (
    private readonly value: any,
    private readonly fieldName?: string,
    private readonly validators: Validator[] = []
  ) {}

  static of (params: BuilderParams): ValidationBuilder {
    return new ValidationBuilder(params.value, params.fieldName)
  }

  required(): ValidationBuilder {
    if(this.value instanceof Buffer) this.buffer(this.value)
    else if (typeof this.value === 'string') this.string()
    else if (typeof this.value === 'object') {
      this.object()
      if(this.value.buffer !== undefined) {
        this.buffer(this.value.buffer)
      }
    }
    return this
  }

  object(): ValidationBuilder {
    this.validators.push(new RequiredValidator(this.value, this.fieldName))
    return this
  }

  buffer (value: Buffer): ValidationBuilder {
    this.validators.push(new RequiredBufferValidator(value, this.fieldName))
    return this
  }

  string (): ValidationBuilder {
    this.validators.push(new RequiredStringValidator(this.value, this.fieldName))
    return this
  }

  image(args: { allowedExtensions: AllowedExtensions[], maxSizeInMb: number }): ValidationBuilder {
    if(this.value.mimeType !== undefined) {
      this.validators.push(new AllowedMimeTypesValidator(args.allowedExtensions, this.value.mimeType))
    }
    if(this.value.buffer !== undefined) {
      this.validators.push(new MaxFileSizeValidator(args.maxSizeInMb, this.value.buffer))
    }
    return this
  }

  build (): Validator[] {
    return this.validators
  }
}
