import { getRepository } from 'typeorm'

import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@data/protocols/repositories'
import { PostgresUser } from '@infra/postgres/entities'

type LoadParams = ILoadUserAccountRepository.Params
type LoadResult = ILoadUserAccountRepository.Result

type SaveParams = ISaveFacebookAccountRepository.Params
// type SaveResult = ISaveFacebookAccountRepository.Result

export class PostgresUserAccountRepository implements ILoadUserAccountRepository {
  private readonly postgresUserRepository = getRepository(PostgresUser)

  async saveWithFacebook (params: SaveParams): Promise<void> {
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

  async load (params: LoadParams): Promise<LoadResult> {
    const postgresUser = await this.postgresUserRepository.findOne({ email: params.email })
    if (postgresUser !== undefined) {
      return {
        id: postgresUser.id.toString(),
        name: postgresUser.name ?? undefined
      }
    }
  }
}
