import { AccessToken } from '@domain/models'
import { FacebookAuthentication } from '@domain/features'
import { Controller, HttpResponse, Validator } from '@app/protocols'
import { ok, unauthorized } from '@app/helpers/http-helpers'
import { ValidationBuilder } from '@app/validators'

type HttpRequest = { token: string }

type Model = Error | { accessToken: string }

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
    super()
  }

  async execute (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuthentication.execute({ token: httpRequest.token })
    return accessToken instanceof AccessToken
      ? ok({ accessToken: accessToken.value })
      : unauthorized()
  }

  buildValidators (httpRequest: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({
        value: httpRequest.token, fieldName: 'token'
      }).required().build()
    ]
  }
}
