import { ObjectType, Repository } from 'typeorm'

import { PostgresConnection } from '@infra/typeorm/helpers';

export abstract class PostgresRepository {
  constructor(private readonly connection: PostgresConnection = PostgresConnection.getInstance()) {}

  getRepository<Entity> (entity: ObjectType<Entity>): Repository<Entity> {
    return this.connection.getRepository(entity)
  }
}