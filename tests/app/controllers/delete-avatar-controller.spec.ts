import { ChangeProfileAvatarService } from '@core/usecases'

type HttpRequest = { userId: string }

class DeleteAvatarController {
  constructor(private readonly changeProfileAvatar: ChangeProfileAvatarService) {}

  async handle({ userId }: HttpRequest): Promise<void> {
    await this.changeProfileAvatar({ userId })
  }
}

describe('delete-avatar controller', () => {
  test('should call change-profile-avatar with correct args', async () => {
    const changeProfileAvatar = jest.fn()
    const sut = new DeleteAvatarController(changeProfileAvatar)
    await sut.handle({ userId: 'any_user_id' })

    expect(changeProfileAvatar).toHaveBeenCalledWith({ userId: 'any_user_id' })
    expect(changeProfileAvatar).toHaveBeenCalledTimes(1)
  })
})