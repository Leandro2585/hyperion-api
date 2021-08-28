import { getRepository } from 'typeorm'

import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@data/protocols/repositories'
import { PostgresUser } from '@infra/postgres/entities'

type LoadParams = ILoadUserAccountRepository.Params
type LoadResult = ILoadUserAccountRepository.Result

type SaveParams = ISaveFacebookAccountRepository.Params
type SaveResult = ISaveFacebookAccountRepository.Result

export class PostgresUserAccountRepository implements ILoadUserAccountRepository, ISaveFacebookAccountRepository {
  private readonly postgresUserRepository = getRepository(PostgresUser)

  async saveWithFacebook (params: SaveParams): Promise<SaveResult> {
    let id: string
    if (params.id === undefined) {
      const postgresUser = await this.postgresUserRepository.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId
      })
      id = postgresUser.id.toString()
    } else {
      id = params.id
      await this.postgresUserRepository.update({
        id: parseInt(params.id)
      }, {
        name: params.name,
        facebookId: params.facebookId
      })
    }
    return { id }
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
