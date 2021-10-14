import { noContent } from '@app/helpers/http-helpers'
import { Controller, HttpResponse } from '@app/protocols'
import { ChangeProfileAvatarService } from '@core/usecases'

type HttpRequest = { userId: string }

export class DeleteAvatarController extends Controller {
  constructor(private readonly changeProfileAvatar: ChangeProfileAvatarService) {
    super()
  }

  async execute({ userId }: HttpRequest): Promise<HttpResponse> {
    await this.changeProfileAvatar({ userId })
    return noContent()
  }
}
