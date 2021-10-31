import { SaveAvatarController } from '@app/controllers'
import { makeChangeProfileAvatar } from '@main/factories/usecases'

export const makeSaveAvatarController = (): SaveAvatarController => {
  return new SaveAvatarController(makeChangeProfileAvatar())
}