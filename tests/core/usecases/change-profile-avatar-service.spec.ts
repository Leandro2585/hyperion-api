import { mocked } from 'ts-jest/utils'
import { mock, MockProxy } from 'jest-mock-extended'

import { UserProfile } from '@core/models'
import { UUIDGenerator } from '@core/protocols/cryptography'
import { UploadFile, DeleteFile } from '@core/protocols/gateways'
import { LoadUserProfile, SaveUserAvatar } from '@core/protocols/repositories'
import { ChangeProfileAvatarService, setupUploadProfileAvatar } from '@core/usecases'

jest.mock('@core/models/user-profile')

describe('change-profile-avatar usecase', () => {
  let uuid: string
  let file: { buffer: Buffer, mimeType: string }
  let buffer: Buffer
  let mimeType: string
  let userId: string
  let fileStorage: MockProxy<UploadFile & DeleteFile>
  let cryptography: MockProxy<UUIDGenerator>
  let userProfileRepository: MockProxy<SaveUserAvatar & LoadUserProfile>
  let sut: ChangeProfileAvatarService

  beforeAll(() => {
    uuid = 'any_unique_id'
    userId = 'any_user_id'
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
    file = { buffer, mimeType }
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

  test('should call UploadFile with correct args', async () => {
    await sut({ userId, file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file: buffer, fileName: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  test('should call UploadFile with correct args', async () => {
    userProfileRepository.load.mockResolvedValueOnce(undefined)
    await sut({ userId, file: { buffer, mimeType: 'image/png' } })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file: buffer, fileName: `${uuid}.png` })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  test('should not call UploadFile when file is undefined', async () => {
    await sut({ userId, file: undefined })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })

  test('should call SaveUserAvatar with correct args', async () => {
    await sut({ userId, file })

    expect(userProfileRepository.saveAvatar).toHaveBeenCalledWith(mocked(UserProfile).mock.instances[0])
    expect(userProfileRepository.saveAvatar).toHaveBeenCalledTimes(1)
  })

  test('should call LoadUserProfile with correct args', async () => {
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

  test('should call DeleteFile when file exists and SaveUserAvatar throws', async () => {
    userProfileRepository.saveAvatar.mockRejectedValueOnce(new Error())
    expect.assertions(2)

    sut({ userId, file }).catch(() => {
      expect(fileStorage.delete).toHaveBeenCalledWith({ fileName: uuid })
      expect(fileStorage.delete).toHaveBeenCalledTimes(1)
    })
  })

  test('should not call DeleteFile when file does not exists and SaveUserAvatar throws', async () => {
    userProfileRepository.saveAvatar.mockRejectedValueOnce(new Error())
    expect.assertions(2)

    sut({ userId, file: undefined }).catch(() => {
      expect(fileStorage.delete).not.toHaveBeenCalled()
    })
  })

  test('should rethrow if SaveUserAvatar throws', async () => {
    const error = new Error('save_error')
    userProfileRepository.saveAvatar.mockRejectedValueOnce(error)
    const promise = sut({ userId, file })

    await expect(promise).rejects.toThrow(error)
  })
})
