import { ChangeProfileAvatarService } from '@core/usecases'

type HttpRequest = { userId: string }

class DeleteAvatarController {
  constructor(private readonly changeProfileAvatar: ChangeProfileAvatarService) {}

  async handle({ userId }: HttpRequest): Promise<void> {
    await this.changeProfileAvatar({ userId })
  }
}

describe('delete-avatar controller', () => {
  let changeProfileAvatar: jest.Mock
  let sut: DeleteAvatarController

  beforeAll(() => {
    changeProfileAvatar = jest.fn()
  })

  beforeEach(() => {
    sut = new DeleteAvatarController(changeProfileAvatar)
  })

  test('should call change-profile-avatar with correct args', async () => {
    await sut.handle({ userId: 'any_user_id' })

    expect(changeProfileAvatar).toHaveBeenCalledWith({ userId: 'any_user_id' })
    expect(changeProfileAvatar).toHaveBeenCalledTimes(1)
  })
})