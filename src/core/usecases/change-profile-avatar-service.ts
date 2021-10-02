import { UploadFile, UUIDGenerator } from '@core/protocols/gateways'
import { SaveUserAvatar, LoadUserProfile } from '@core/protocols/repositories'

type Setup = (fileStorage: UploadFile, cryptography: UUIDGenerator, userProfileRepository: SaveUserAvatar & LoadUserProfile) => ChangeProfileAvatarService
type Input = { userId: string, file?: Buffer }
export type ChangeProfileAvatarService = (input: Input) => Promise<void>

export const setupUploadProfileAvatar: Setup = (fileStorage, cryptography, userProfileRepository) => async ({ file, userId }) => {
  let avatarUrl: string | undefined
  if (file !== undefined) {
    avatarUrl = await fileStorage.upload({ file, key: cryptography.uuid({ key: userId }) })
  } else {
    await userProfileRepository.load({ userId })
  }
  await userProfileRepository.saveAvatar({ avatarUrl })
}
