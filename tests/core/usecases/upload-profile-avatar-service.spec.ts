import { mock, MockProxy } from 'jest-mock-extended'

type Setup = (fileStorage: UploadFile, cryptography: UUIDGenerator) => ChangeProfileAvatarService
type Input = { userId: string, file: Buffer }
type ChangeProfileAvatarService = (input: Input) => Promise<void>

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
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile>
  let cryptography: MockProxy<UUIDGenerator>
  let sut: ChangeProfileAvatarService

  beforeEach(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock()
    cryptography = mock()
    cryptography.uuid.mockReturnValue(uuid)
    sut = setupUploadProfileAvatar(fileStorage, cryptography)
  })

  test('should call UploadFile with correct params', async () => {
    await sut({ userId: 'any_user_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
