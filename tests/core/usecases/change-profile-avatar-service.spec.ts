import { mocked } from 'ts-jest/utils'
import { mock, MockProxy } from 'jest-mock-extended'

import { UserProfile } from '@core/models'
import { UploadFile, UUIDGenerator } from '@core/protocols/gateways'
import { LoadUserProfile, SaveUserAvatar } from '@core/protocols/repositories'
import { ChangeProfileAvatarService, setupUploadProfileAvatar } from '@core/usecases'

jest.mock('@core/models/user-profile')

describe('change-profile-avatar usecase', () => {
  let uuid: string
  let file: Buffer
  let userId: string
  let fileStorage: MockProxy<UploadFile>
  let cryptography: MockProxy<UUIDGenerator>
  let userProfileRepository: MockProxy<SaveUserAvatar & LoadUserProfile>
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
    userProfileRepository.load.mockResolvedValue({ name: 'Leandro Real Vieira' })
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

    expect(userProfileRepository.saveAvatar).toHaveBeenCalledWith(mocked(UserProfile).mock.instances[0])
    expect(userProfileRepository.saveAvatar).toHaveBeenCalledTimes(1)
  })

  test('should call LoadUserProfile with correct params', async () => {
    await sut({ userId, file: undefined })

    expect(userProfileRepository.load).toHaveBeenCalledWith({ userId })
    expect(userProfileRepository.load).toHaveBeenCalledTimes(1)
  })

  test('should not call LoadUserProfile if file exists', async () => {
    await sut({ userId, file })

    expect(userProfileRepository.load).not.toHaveBeenCalled()
  })

  test('should return correct data on success', async () => {
    mocked(UserProfile).mockImplementationOnce((id) => ({
      setAvatar: jest.fn(),
      id: 'any_user_id',
      avatarUrl: 'any_url',
      initials: 'any_initials'
    }))
    const result = await sut({ userId, file })

    expect(result).toMatchObject({
      avatarUrl: 'any_url',
      initials: 'any_initials'
    })
  })
})
