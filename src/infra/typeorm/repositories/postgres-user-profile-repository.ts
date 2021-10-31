import { getRepository } from 'typeorm'

import { SaveUserAvatar, LoadUserProfile } from '@core/protocols/repositories'
import { PostgresUser } from '@infra/typeorm/entities'

export class PostgresUserProfileRepository implements SaveUserAvatar, LoadUserProfile {
  async saveAvatar ({ id, avatarUrl, initials }: SaveUserAvatar.Input): Promise<void> {
    const postgresUserRepository = getRepository(PostgresUser)
    await postgresUserRepository.update({ id }, { avatarUrl, initials})
  }

  async load ({ userId }: LoadUserProfile.Input): Promise<LoadUserProfile.Output> {
    const postgresUserRepository = getRepository(PostgresUser)
    const postgresUser = await postgresUserRepository.findOne({ id: userId })
    if(postgresUser !== undefined) return { name: postgresUser.name ?? undefined }
  }
}
