import { UploadFile, UUIDGenerator } from '@core/protocols/gateways'
import { SaveUserAvatar, LoadUserProfile } from '@core/protocols/repositories'

type Setup = (fileStorage: UploadFile, cryptography: UUIDGenerator, userProfileRepository: SaveUserAvatar & LoadUserProfile) => ChangeProfileAvatarService
type Input = { userId: string, file?: Buffer }
export type ChangeProfileAvatarService = (input: Input) => Promise<void>

export const setupUploadProfileAvatar: Setup = (fileStorage, cryptography, userProfileRepository) => async ({ file, userId }) => {
  let avatarUrl: string | undefined
  let initials: string | undefined
  if (file !== undefined) {
    avatarUrl = await fileStorage.upload({ file, key: cryptography.uuid({ key: userId }) })
  } else {
    const { name } = await userProfileRepository.load({ userId })
    if (name !== undefined) {
      const firstLetters = name.match(/\b(.)/g) ?? []
      if (firstLetters.length > 1) {
        initials = `${firstLetters.shift() ?? ''}${firstLetters.pop() ?? ''}`.toUpperCase()
      } else {
        initials = name.substr(0, 2)?.toUpperCase()
      }
    }
  }
  await userProfileRepository.saveAvatar({ avatarUrl, initials })
}
