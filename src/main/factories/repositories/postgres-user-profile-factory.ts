import { PostgresUserProfileRepository } from '@infra/typeorm/repositories';

export const makePostgresUserProfileRepositoryFactory = (): PostgresUserProfileRepository => {
  return new PostgresUserProfileRepository()
}