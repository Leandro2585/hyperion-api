import { RequiredFieldError } from '@app/errors';
import { Validator } from '@app/protocols';

export class RequiredValidator implements Validator {
  constructor(
    readonly value: any, 
    readonly fieldName?: string
  ){}
  
  validate(): Error | undefined {
    if(this.value === null || this.value === undefined) {
      return new RequiredFieldError(this.fieldName)
    }
  }
}