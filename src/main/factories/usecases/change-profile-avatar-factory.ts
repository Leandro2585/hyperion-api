import { ChangeProfileAvatarService, setupUploadProfileAvatar } from '@core/usecases'
import { makePostgresUserProfileRepositoryFactory } from '@main/factories/repositories'
import { makeUUIDGenerator } from '@main/factories/cryptography'
import { makeAwsS3FileStorage } from '@main/factories/gateways'

export const makeChangeProfileAvatar = (): ChangeProfileAvatarService => {
  return setupUploadProfileAvatar(
    makeAwsS3FileStorage(), 
    makeUUIDGenerator(), 
    makePostgresUserProfileRepositoryFactory()
  )
}