import { RequiredFieldError } from '@app/errors'
import { RequiredValidator } from '.'

export class RequiredStringValidator extends RequiredValidator {
  constructor (
    override readonly value: string,
    override readonly fieldName?: string
  ) {
    super(value, fieldName)
  }

  override validate (): Error | undefined {
    if (super.validate() !== undefined || this.value === '') {
      return new RequiredFieldError(this.fieldName)
    }
  }
}
