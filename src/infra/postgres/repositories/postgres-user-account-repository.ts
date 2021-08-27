import { getRepository } from 'typeorm'

import { ILoadUserAccountRepository } from '@data/protocols/repositories'
import { PostgresUser } from '@infra/postgres/entities'

export class PostgresUserAccountRepository implements ILoadUserAccountRepository {
  async load (params: ILoadUserAccountRepository.Params): Promise<ILoadUserAccountRepository.Result> {
    const postgresUserRepository = getRepository(PostgresUser)
    const postgresUser = await postgresUserRepository.findOne({ email: params.email })
    if (postgresUser !== undefined) {
      return {
        id: postgresUser.id.toString(),
        name: postgresUser.name ?? undefined
      }
    }
  }
}
