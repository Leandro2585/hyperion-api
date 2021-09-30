import { UploadFile, UUIDGenerator } from '@core/protocols/gateways'

type Setup = (fileStorage: UploadFile, cryptography: UUIDGenerator) => ChangeProfileAvatarService
type Input = { userId: string, file: Buffer }
export type ChangeProfileAvatarService = (input: Input) => Promise<void>

export const setupUploadProfileAvatar: Setup = (fileStorage, cryptography) => async ({ file, userId }) => {
  await fileStorage.upload({ file, key: cryptography.uuid({ key: userId }) })
}
