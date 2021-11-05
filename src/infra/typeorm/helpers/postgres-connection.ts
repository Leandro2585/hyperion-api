import { ConnectionNotFoundError } from '@infra/typeorm/helpers'

import { getConnection, getConnectionManager, QueryRunner, Connection, ObjectType, createConnection, Repository } from 'typeorm'

export class PostgresConnection {
  private static instance?: PostgresConnection
  private query?: QueryRunner

  private constructor () {}

  static getInstance (): PostgresConnection {
    if(PostgresConnection.instance === undefined) {
      PostgresConnection.instance = new PostgresConnection
    }
    return PostgresConnection.instance
  }

  async connect(): Promise<void> {
    const connection: Connection = getConnectionManager().has('default')
      ? getConnection()
      : await createConnection()
    this.query = connection.createQueryRunner()
  }

  async disconnect(): Promise<void> {
    if (this.query === undefined) throw new ConnectionNotFoundError()
    await getConnection().close()
    this.query = undefined
  }

  async openTransaction(): Promise<void> {
    if (this.query === undefined) throw new ConnectionNotFoundError()
    await this.query.startTransaction()
  }

  async closeTransaction(): Promise<void> {
    if (this.query === undefined) throw new ConnectionNotFoundError()
    await this.query.release()
  }

  async commit(): Promise<void> {
    if (this.query === undefined) throw new ConnectionNotFoundError()
    await this.query.commitTransaction()
  }

  async rollback(): Promise<void> {
    if (this.query === undefined) throw new ConnectionNotFoundError()
    await this.query.rollbackTransaction()
  }

  getRepository<Entity> (entity: ObjectType<Entity>): Repository<Entity> {
    if (this.query === undefined) throw new ConnectionNotFoundError()
    return this.query.manager.getRepository(entity)
  }
}
