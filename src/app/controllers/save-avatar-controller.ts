import { ChangeProfileAvatarService } from '@core/usecases'
import { ok } from '@app/helpers/http-helpers'
import { Controller, HttpResponse, Validator } from '@app/protocols'
import { AllowedMimeTypesValidator, MaxFileSizeValidator, RequiredBufferValidator, RequiredValidator } from '@app/validators'

type HttpRequest = { userId: string, file: { buffer: Buffer, mimeType: string } }
type Model = Error | { initials?: string, avatarUrl?: string }

export class SaveAvatarController extends Controller {
  constructor(private readonly changeProfileAvatar: ChangeProfileAvatarService) {
    super()
  }

  async execute ({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
    const result = await this.changeProfileAvatar({ userId, file: file.buffer })
    return ok(result)
  }

  override buildValidators({ file }: HttpRequest): Validator[] {
    return [
      new RequiredValidator(file, 'file'),
      new RequiredBufferValidator(file.buffer, 'file'),
      new AllowedMimeTypesValidator(['png', 'jpg'], file.mimeType),
      new MaxFileSizeValidator(5, file.buffer)
    ]
  }
}