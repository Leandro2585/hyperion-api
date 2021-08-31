import { AccessToken } from '@domain/models'
import { FacebookAuthentication } from '@domain/features'
import { Controller, HttpResponse } from '@app/protocols'
import { RequiredFieldError } from '@app/errors'
import { badRequest, ok, serverError, unauthorized } from '@app/helpers/http-helpers'

type HttpRequest = {
  token: string
}

type Model = Error | { accessToken: string }

export class FacebookLoginController implements Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const error = this.validate(httpRequest)
      if (error !== undefined) {
        return badRequest(error)
      }
      const accessToken = await this.facebookAuthentication.execute({ token: httpRequest.token })
      if (accessToken instanceof AccessToken) {
        return ok({ accessToken: accessToken.value })
      } else {
        return unauthorized()
      }
    } catch (error) {
      return serverError(error)
    }
  }

  private validate (httpRequest: HttpRequest): Error | undefined {
    if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
      return new RequiredFieldError('token')
    }
  }
}
