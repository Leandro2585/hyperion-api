import { Controller, HttpResponse, Validator } from '@app/protocols'
import { ValidationBuilder } from '@app/validators'
import { ok } from '@app/helpers/http-helpers'
import { ChangeProfileAvatarService } from '@core/usecases'

type HttpRequest = { userId: string, file: { buffer: Buffer, mimeType: string } }
type Model = Error | { initials?: string, avatarUrl?: string }

export class SaveAvatarController extends Controller {
  constructor(private readonly changeProfileAvatar: ChangeProfileAvatarService) {
    super()
  }

  async execute ({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
    const result = await this.changeProfileAvatar({ userId, file })
    return ok(result)
  }

  override buildValidators({ file }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: file, fieldName: 'file' })
        .required()
        .image({ allowedExtensions: ['png', 'jpg'], maxSizeInMb: 5 })
        .build()
    ]
  }
}