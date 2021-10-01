import { UploadFile, UUIDGenerator } from '@core/protocols/gateways'
import { SaveUserAvatar } from '@core/protocols/repositories'

type Setup = (fileStorage: UploadFile, cryptography: UUIDGenerator, userProfileRepository: SaveUserAvatar) => ChangeProfileAvatarService
type Input = { userId: string, file?: Buffer }
export type ChangeProfileAvatarService = (input: Input) => Promise<void>

export const setupUploadProfileAvatar: Setup = (fileStorage, cryptography, userProfileRepository) => async ({ file, userId }) => {
  if (file !== undefined) {
    const avatarUrl = await fileStorage.upload({ file, key: cryptography.uuid({ key: userId }) })
    await userProfileRepository.saveAvatar({ avatarUrl })
  }
}
