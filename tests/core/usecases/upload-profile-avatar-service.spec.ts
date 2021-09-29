import { mock } from 'jest-mock-extended'

type Setup = (fileStorage: UploadFile, cryptography: UUIDGenerator) => UploadProfileAvatar
type Input = { userId: string, file: Buffer }
type UploadProfileAvatar = (input: Input) => Promise<void>

const setupUploadProfileAvatar: Setup = (fileStorage, cryptography) => async ({ file, userId }) => {
  await fileStorage.upload({ file, key: cryptography.uuid({ key: userId }) })
}

interface UploadFile {
  upload: (params: UploadFile.Params) => Promise<void>
}

export namespace UploadFile {
  export type Params = { file: Buffer, key: string }
}

interface UUIDGenerator {
  uuid: (params: UUIDGenerator.Params) => UUIDGenerator.Result
}

export namespace UUIDGenerator {
  export type Params = { key: string }
  export type Result = string
}

describe('upload-profile-avatar usecase', () => {
  test('should call UploadFile with correct params', async () => {
    const uuid = 'any_unique_id'
    const file = Buffer.from('any_buffer')
    const fileStorage = mock<UploadFile>()
    const cryptography = mock<UUIDGenerator>()
    cryptography.uuid.mockReturnValue(uuid)
    const sut = setupUploadProfileAvatar(fileStorage, cryptography)
    await sut({ userId: 'any_user_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
