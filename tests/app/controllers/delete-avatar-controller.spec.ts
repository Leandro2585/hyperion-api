import { Controller } from '@app/protocols'
import { DeleteAvatarController } from '@app/controllers'

describe('delete-avatar controller', () => {
  let changeProfileAvatar: jest.Mock
  let sut: DeleteAvatarController

  beforeAll(() => {
    changeProfileAvatar = jest.fn()
  })

  beforeEach(() => {
    sut = new DeleteAvatarController(changeProfileAvatar)
  })

  test('should extend controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  test('should call change-profile-avatar with correct args', async () => {
    await sut.handle({ userId: 'any_user_id' })

    expect(changeProfileAvatar).toHaveBeenCalledWith({ userId: 'any_user_id' })
    expect(changeProfileAvatar).toHaveBeenCalledTimes(1)
  })

  test('should return 204', async () => {
    const httpResponse = await sut.handle({ userId: 'any_user_id' })

    expect(httpResponse).toEqual({
      statusCode: 204,
      data: null
    })
  })
})