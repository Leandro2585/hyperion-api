import { forbidden, ok } from '@app/helpers'
import { HttpResponse } from '@app/protocols'
import { Middleware } from '@app/protocols/middleware'
import { RequiredStringValidator } from '@app/validators'

type HttpRequest = { authorization: string }
type Model = Error | { userId: string }
type AuthorizeService = (args: { token: string }) => Promise<string>

export class AuthenticationMiddleware implements Middleware {
  constructor (private readonly authorize: AuthorizeService) {}

  async handle ({ authorization }: HttpRequest): Promise<HttpResponse<Model>> {
    if (!this.validate({ authorization })) return forbidden()
    try {
      const userId = await this.authorize({ token: authorization })
      return ok({ userId })
    } catch {
      return forbidden()
    }
  }

  private validate ({ authorization }: HttpRequest): boolean {
    const error = new RequiredStringValidator(authorization, 'authorization').validate()
    return error === undefined
  }
}
