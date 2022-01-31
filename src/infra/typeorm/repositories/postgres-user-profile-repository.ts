import { SaveUserAvatar, LoadUserProfile } from '@core/protocols/repositories'
import { PostgresUser } from '@infra/typeorm/entities'
import { PostgresRepository } from '../protocols'

export class PostgresUserProfileRepository extends PostgresRepository implements SaveUserAvatar, LoadUserProfile {
  async saveAvatar ({ id, avatarUrl, initials }: SaveUserAvatar.Input): Promise<void> {
    const postgresUserRepository = this.getRepository(PostgresUser)
    await postgresUserRepository.update({ id }, { avatarUrl, initials})
  }

  async load ({ userId }: LoadUserProfile.Input): Promise<LoadUserProfile.Output> {
    const postgresUserRepository = this.getRepository(PostgresUser)
    const postgresUser = await postgresUserRepository.findOne({ id: userId })
    if(postgresUser !== undefined) return { name: postgresUser.name ?? undefined }
  }
}
