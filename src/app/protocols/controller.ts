import { badRequest, serverError } from '@app/helpers'
import { HttpResponse, Validator } from '@app/protocols'
import { ValidationComposite } from '@app/validators'

export abstract class Controller {
  abstract execute (httpRequest: any): Promise<HttpResponse>
  buildValidators (httpRequest: any): Validator[] {
    return []
  }

  async handle (httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest)
    if (error !== undefined) {
      return badRequest(error)
    }
    try {
      return await this.execute(httpRequest)
    } catch (error) {
      return serverError(error)
    }
  }

  private validate (httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest)
    return new ValidationComposite(validators).validate()
  }
}
