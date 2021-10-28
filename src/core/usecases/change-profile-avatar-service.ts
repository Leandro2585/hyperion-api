import { UserProfile } from '@core/models'
import { UUIDGenerator } from '@core/protocols/cryptography'
import { UploadFile, DeleteFile } from '@core/protocols/gateways'
import { SaveUserAvatar, LoadUserProfile } from '@core/protocols/repositories'

type Setup = (fileStorage: UploadFile & DeleteFile, cryptography: UUIDGenerator, userProfileRepository: SaveUserAvatar & LoadUserProfile) => ChangeProfileAvatarService
type Input = { userId: string, file?: { buffer: Buffer, mimeType: string } }
type Output = { avatarUrl?: string, initials?: string }

export type ChangeProfileAvatarService = (input: Input) => Promise<Output>

export const setupUploadProfileAvatar: Setup = (fileStorage, cryptography, userProfileRepository) => async ({ file, userId }) => {
  const key = cryptography.uuid({ key: userId })
  const data = {
    avatarUrl: file !== undefined ? await fileStorage.upload({ file: file.buffer, fileName: `${key}.${file.mimeType.split('/')[1]}` }) : undefined,
    name: file === undefined ? (await userProfileRepository.load({ userId }))?.name : undefined
  }
  const userProfile = new UserProfile(userId)
  userProfile.setAvatar(data)
  try {
    await userProfileRepository.saveAvatar(userProfile)
  } catch (error) {
    file !== undefined && await fileStorage.delete({ fileName: key })
    throw error
  }
  return userProfile
}
