import { getRepository } from 'typeorm'

import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@core/protocols/repositories'
import { PostgresUser } from '@infra/database/entities'

type LoadInput= LoadUserAccountRepository.Params
type LoadOutput = LoadUserAccountRepository.Result
type SaveInput = SaveFacebookAccountRepository.Params
type SaveOutput = SaveFacebookAccountRepository.Result

export class PostgresUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  async saveWithFacebook ({ id, name, email, facebookId }: SaveInput): Promise<SaveOutput> {
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

  async load ({ email }: LoadInput): Promise<LoadOutput> {
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
