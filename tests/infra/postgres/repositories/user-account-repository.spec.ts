import { ILoadUserAccountRepository } from '@data/protocols/repositories'

class PostgresUserAccountRepository implements ILoadUserAccountRepository {
  async load (params: ILoadUserAccountRepository.Params): Promise<ILoadUserAccountRepository.Result> {
    return await Promise.resolve(undefined)
  }
}

describe('user-account repository', () => {
  describe('load', () => {
    test('', async () => {
      const sut = new PostgresUserAccountRepository()

      await sut.load({ email: 'existing_email' })
    })
  })
})
