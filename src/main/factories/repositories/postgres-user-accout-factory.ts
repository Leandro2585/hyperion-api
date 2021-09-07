import { PostgresUserAccountRepository } from '@infra/typeorm/repositories'

export const makePgUserAccountRepositoryFactory = (): PostgresUserAccountRepository => {
  return new PostgresUserAccountRepository()
}
