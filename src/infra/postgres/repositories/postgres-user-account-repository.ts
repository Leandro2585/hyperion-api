import { getRepository, Repository } from 'typeorm'

import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@data/protocols/repositories'
import { PostgresUser } from '@infra/postgres/entities'

export class PostgresUserAccountRepository implements ILoadUserAccountRepository {
  postgresUserRepository: Repository<PostgresUser>

  constructor () {
    this.postgresUserRepository = getRepository(PostgresUser)
  }

  async saveWithFacebook (params: ISaveFacebookAccountRepository.Params): Promise<void> {
    if (params.id === undefined) {
      await this.postgresUserRepository.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId
      })
    } else {
      await this.postgresUserRepository.update({
        id: parseInt(params.id)
      }, {
        name: params.name,
        facebookId: params.facebookId
      })
    }
  }

  async load (params: ILoadUserAccountRepository.Params): Promise<ILoadUserAccountRepository.Result> {
    const postgresUser = await this.postgresUserRepository.findOne({ email: params.email })
    if (postgresUser !== undefined) {
      return {
        id: postgresUser.id.toString(),
        name: postgresUser.name ?? undefined
      }
    }
  }
}
