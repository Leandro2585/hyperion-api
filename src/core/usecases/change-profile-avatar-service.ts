import { UserProfile } from '@core/models'
import { UploadFile, UUIDGenerator } from '@core/protocols/gateways'
import { SaveUserAvatar, LoadUserProfile } from '@core/protocols/repositories'

type Setup = (fileStorage: UploadFile, cryptography: UUIDGenerator, userProfileRepository: SaveUserAvatar & LoadUserProfile) => ChangeProfileAvatarService
type Input = { userId: string, file?: Buffer }
export type ChangeProfileAvatarService = (input: Input) => Promise<void>

export const setupUploadProfileAvatar: Setup = (fileStorage, cryptography, userProfileRepository) => async ({ file, userId }) => {
  const data: { avatarUrl?: string, name?: string } = {}
  if (file !== undefined) {
    data.avatarUrl = await fileStorage.upload({ file, key: cryptography.uuid({ key: userId }) })
  } else {
    data.name = (await userProfileRepository.load({ userId })).name
  }
  const userProfile = new UserProfile(userId)

  userProfile.setAvatar(data)
  await userProfileRepository.saveAvatar(userProfile)
}
