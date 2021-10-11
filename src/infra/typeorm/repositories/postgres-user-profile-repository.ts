import { getRepository } from 'typeorm'

import { SaveUserAvatar } from '@core/protocols/repositories'
import { PostgresUser } from '@infra/typeorm/entities'

type Input = SaveUserAvatar.Input

export class PostgresUserProfileRepository implements SaveUserAvatar {
  async saveAvatar ({ id, avatarUrl, initials }: Input): Promise<void> {
    const postgresUserRepository = getRepository(PostgresUser)
    await postgresUserRepository.update({ id }, { avatarUrl, initials})
  }
}
