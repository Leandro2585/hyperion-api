import { getRepository } from 'typeorm'

import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@core/protocols/repositories'
import { PostgresUser } from '@infra/database/entities'

type LoadParams = ILoadUserAccountRepository.Params
type LoadResult = ILoadUserAccountRepository.Result
type SaveParams = ISaveFacebookAccountRepository.Params
type SaveResult = ISaveFacebookAccountRepository.Result

export class PostgresUserAccountRepository implements ILoadUserAccountRepository, ISaveFacebookAccountRepository {
  async saveWithFacebook ({ id, name, email, facebookId }: SaveParams): Promise<SaveResult> {
    const postgresUserRepository = getRepository(PostgresUser)
    let resultId: string
    if (id === undefined) {
      const postgresUser = await postgresUserRepository.save({ email, name, facebookId })
      resultId = postgresUser.id.toString()
    } else {
      resultId = id
      await postgresUserRepository.update({ id: id }, { name, facebookId })
    }
    return { id: resultId }
  }

  async load ({ email }: LoadParams): Promise<LoadResult> {
    const postgresUserRepository = getRepository(PostgresUser)
    const postgresUser = await postgresUserRepository.findOne({ email })
    if (postgresUser !== undefined) {
      return {
        id: postgresUser.id.toString(),
        name: postgresUser.name ?? undefined
      }
    }
  }
}
