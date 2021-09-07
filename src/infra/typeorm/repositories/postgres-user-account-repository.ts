import { getRepository } from 'typeorm'

import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@data/protocols/repositories'
import { PostgresUser } from '@infra/typeorm/entities'

type LoadParams = ILoadUserAccountRepository.Params
type LoadResult = ILoadUserAccountRepository.Result
type SaveParams = ISaveFacebookAccountRepository.Params
type SaveResult = ISaveFacebookAccountRepository.Result

export class PostgresUserAccountRepository implements ILoadUserAccountRepository, ISaveFacebookAccountRepository {
  private readonly postgresUserRepository = getRepository(PostgresUser)

  async saveWithFacebook ({ id, name, email, facebookId }: SaveParams): Promise<SaveResult> {
    let resultId: string
    if (id === undefined) {
      const postgresUser = await this.postgresUserRepository.save({ email, name, facebookId })
      resultId = postgresUser.id.toString()
    } else {
      resultId = id
      await this.postgresUserRepository.update({ id: parseInt(id) }, { name, facebookId })
    }
    return { id: resultId }
  }

  async load ({ email }: LoadParams): Promise<LoadResult> {
    const postgresUser = await this.postgresUserRepository.findOne({ email })
    if (postgresUser !== undefined) {
      return {
        id: postgresUser.id.toString(),
        name: postgresUser.name ?? undefined
      }
    }
  }
}
