import { mock, MockProxy } from 'jest-mock-extended'

import { UploadFile, UUIDGenerator } from '@core/protocols/gateways'
import { ChangeProfileAvatarService, setupUploadProfileAvatar } from '@core/usecases'

describe('change-profile-avatar usecase', () => {
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

  test('should not call UploadFile when file is undefined', async () => {
    await sut({ userId: 'any_user_id', file: undefined })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })
})
