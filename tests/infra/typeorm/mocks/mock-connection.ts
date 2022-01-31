import { IMemoryDb, newDb } from 'pg-mem'
import { PostgresConnection } from '@infra/typeorm/helpers'

export const makeFakeDatabase = async (entities?: any[]): Promise<IMemoryDb> => {
  const database = newDb()
  const connection = await database.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/typeorm/entities/index.ts']
  })
  await connection.synchronize()
  await PostgresConnection.getInstance().connect()
  return database
}
