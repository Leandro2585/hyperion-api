import { Validator } from '@app/protocols'
import { RequiredStringValidator, RequiredValidator, RequiredBufferValidator } from '@app/validators'

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
    if(this.value instanceof Buffer) return this.buffer()
    else if (typeof this.value === 'string') return this.string()
    else if (typeof this.value === 'object') return this.object()
    return this
  }

  object(): ValidationBuilder {
    this.validators.push(new RequiredValidator(this.value, this.fieldName))
    return this
  }

  buffer (): ValidationBuilder {
    this.validators.push(new RequiredBufferValidator(this.value, this.fieldName))
    return this
  }

  string (): ValidationBuilder {
    this.validators.push(new RequiredStringValidator(this.value, this.fieldName))
    return this
  }

  build (): Validator[] {
    return this.validators
  }
}
