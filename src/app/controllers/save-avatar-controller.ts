import { ChangeProfileAvatarService } from '@core/usecases'
import { badRequest, ok } from '@app/helpers/http-helpers'
import { InvalidMimeTypeError, RequiredFieldError, MaxFileSizeError } from '@app/errors'
import { Controller, HttpResponse } from '@app/protocols'

type HttpRequest = { userId: string, file: { buffer: Buffer, mimeType: string } }
type Model = Error | { initials?: string, avatarUrl?: string }

export class SaveAvatarController extends Controller {
  constructor(private readonly changeProfileAvatar: ChangeProfileAvatarService) {
    super()
  }

  async execute ({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
    if(file === undefined || file === null) return badRequest(new RequiredFieldError('file'))
    if(file.buffer.length === 0) return badRequest(new RequiredFieldError('file'))
    if(!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) return badRequest(new InvalidMimeTypeError(['png', 'jpeg']))
    if(file.buffer.length > 5 * 1024 * 1024) return badRequest(new MaxFileSizeError(5))
    const result = await this.changeProfileAvatar({ userId, file: file.buffer })
    return ok(result)
  }
}