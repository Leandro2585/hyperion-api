import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@core/protocols/repositories'
import { PostgresUser } from '@infra/typeorm/entities'
import { PostgresRepository } from '@infra/typeorm/protocols'

type LoadInput= LoadUserAccountRepository.Input
type LoadOutput = LoadUserAccountRepository.Output
type SaveInput = SaveFacebookAccountRepository.Input
type SaveOutput = SaveFacebookAccountRepository.Output

export class PostgresUserAccountRepository extends PostgresRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  async saveWithFacebook ({ id, name, email, facebookId }: SaveInput): Promise<SaveOutput> {
    const postgresUserRepository = this.getRepository(PostgresUser)
    let resultId: string
    if (id === undefined) {
      const postgresUser = await postgresUserRepository.save({ email, name, facebookId })
      resultId = postgresUser.id.toString()
    } else {
      resultId = id
      await postgresUserRepository.update({ id }, { name, facebookId })
    }
    return { id: resultId }
  }

  async load ({ email }: LoadInput): Promise<LoadOutput> {
    const postgresUserRepository = this.getRepository(PostgresUser)
    const postgresUser = await postgresUserRepository.findOne({ email })
    if (postgresUser !== undefined) {
      return {
        id: postgresUser.id.toString(),
        name: postgresUser.name ?? undefined
      }
    }
  }
}
