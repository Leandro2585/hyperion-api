import { mock, MockProxy } from 'jest-mock-extended'

import { SaveUserAvatar } from '@core/protocols/repositories'
import { UploadFile, UUIDGenerator } from '@core/protocols/gateways'
import { ChangeProfileAvatarService, setupUploadProfileAvatar } from '@core/usecases'

describe('change-profile-avatar usecase', () => {
  let uuid: string
  let file: Buffer
  let userId: string
  let fileStorage: MockProxy<UploadFile>
  let cryptography: MockProxy<UUIDGenerator>
  let userProfileRepository: MockProxy<SaveUserAvatar>
  let sut: ChangeProfileAvatarService

  beforeAll(() => {
    uuid = 'any_unique_id'
    userId = 'any_user_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock()
    fileStorage.upload.mockResolvedValue('any_url')
    cryptography = mock()
    cryptography.uuid.mockReturnValue(uuid)
    userProfileRepository = mock()
  })

  beforeEach(() => {
    sut = setupUploadProfileAvatar(fileStorage, cryptography, userProfileRepository)
  })

  test('should call UploadFile with correct params', async () => {
    await sut({ userId, file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  test('should not call UploadFile when file is undefined', async () => {
    await sut({ userId, file: undefined })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })

  test('should call SaveUserAvatar with correct params', async () => {
    await sut({ userId, file })

    expect(userProfileRepository.saveAvatar).toHaveBeenCalledWith({ avatarUrl: 'any_url', initials: undefined })
    expect(userProfileRepository.saveAvatar).toHaveBeenCalledTimes(1)
  })

  test('should call SaveUserAvatar with correct params when file is undefined', async () => {
    await sut({ userId, file: undefined })

    expect(userProfileRepository.saveAvatar).toHaveBeenCalledWith({ avatarUrl: undefined })
    expect(userProfileRepository.saveAvatar).toHaveBeenCalledTimes(1)
  })
})
