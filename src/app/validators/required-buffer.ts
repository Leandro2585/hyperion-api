import { RequiredValidator } from '@app/validators'
import { RequiredFieldError } from '@app/errors'

export class RequiredBufferValidator extends RequiredValidator {
  constructor(
    override readonly value: Buffer, 
    override readonly fieldName?: string) {
    super(value, fieldName)
  }

  override validate(): Error | undefined {
    if(super.validate() !== undefined || this.value.length === 0) {
      return new RequiredFieldError(this.fieldName)
    }
  }
}
