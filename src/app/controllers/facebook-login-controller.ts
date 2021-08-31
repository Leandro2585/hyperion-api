import { AccessToken } from '@domain/models'
import { FacebookAuthentication } from '@domain/features'
import { Controller, HttpResponse } from '@app/protocols'
import { RequiredFieldError } from '@app/errors'
import { badRequest, serverError, unauthorized } from '@app/helpers/http-helpers'

export class FacebookLoginController implements Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return badRequest(new RequiredFieldError('token'))
      }
      const accessToken = await this.facebookAuthentication.execute({ token: httpRequest.token })
      if (accessToken instanceof AccessToken) {
        return {
          statusCode: 200,
          data: {
            accessToken: accessToken.value
          }
        }
      } else {
        return unauthorized()
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
