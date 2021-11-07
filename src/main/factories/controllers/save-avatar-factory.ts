import { SaveAvatarController } from '@app/controllers'
import { Controller } from '@app/protocols'
import { makeChangeProfileAvatar } from '@main/factories/usecases'
import { makePostgresTransactionDecorator } from '@main/factories/decorators'

export const makeSaveAvatarController = (): Controller => {
  const saveAvatarController = new SaveAvatarController(makeChangeProfileAvatar())
  return makePostgresTransactionDecorator(saveAvatarController)
}