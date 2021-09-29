import { mock } from 'jest-mock-extended'

type Setup = (fileStorage: UploadFile) => UploadProfileAvatar
type Input = { userId: string, file: Buffer }
type UploadProfileAvatar = (input: Input) => Promise<void>

const setupUploadProfileAvatar: Setup = (fileStorage) => async ({ file, userId }) => {
  await fileStorage.upload({ file, key: userId })
}

interface UploadFile {
  upload: (params: UploadFile.Params) => Promise<void>
}

export namespace UploadFile {
  export type Params = { file: Buffer, key: string }
}

describe('upload-profile-avatar usecase', () => {
  test('should call IUploadFile with correct params', async () => {
    const file = Buffer.from('any_budder')
    const fileStorage = mock<UploadFile>()
    const sut = setupUploadProfileAvatar(fileStorage)
    await sut({ userId: 'any_user_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_user_id' })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
