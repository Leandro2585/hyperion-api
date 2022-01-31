import { PostgresConnection } from '@infra/typeorm/helpers'

export const makePostgresConnection = (): PostgresConnection => {
  return PostgresConnection.getInstance()
}