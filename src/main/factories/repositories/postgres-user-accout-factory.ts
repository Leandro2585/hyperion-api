import { PostgresUserAccountRepository } from '@infra/database/repositories'

export const makePgUserAccountRepositoryFactory = (): PostgresUserAccountRepository => {
  return new PostgresUserAccountRepository()
}
