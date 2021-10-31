import { DeleteAvatarController } from '@app/controllers'
import { makeChangeProfileAvatar } from '@main/factories/usecases'

export const makeDeleteAvatarController = (): DeleteAvatarController => {
  return new DeleteAvatarController(makeChangeProfileAvatar())
}