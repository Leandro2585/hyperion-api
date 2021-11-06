import { getConnection, getRepository, getConnectionManager, QueryRunner, Connection, ObjectType, createConnection, Repository } from 'typeorm'

import { ConnectionNotFoundError, TransactionNotFoundError } from '@infra/typeorm/helpers'

export class PostgresConnection {
  private static instance?: PostgresConnection
  private query?: QueryRunner
  private connection?: Connection

  private constructor () {}

  static getInstance (): PostgresConnection {
    if(PostgresConnection.instance === undefined) {
      PostgresConnection.instance = new PostgresConnection
    }
    return PostgresConnection.instance
  }

  async connect(): Promise<void> {
    this.connection = getConnectionManager().has('default')
      ? getConnection()
      : await createConnection()
  }

  async disconnect(): Promise<void> {
    if (this.connection === undefined) throw new ConnectionNotFoundError()
    await getConnection().close()
    this.query = undefined
    this.connection = undefined
  }

  async openTransaction(): Promise<void> {
    if (this.connection === undefined) throw new ConnectionNotFoundError()
    this.query = this.connection.createQueryRunner()
    await this.query.startTransaction()
  }

  async closeTransaction(): Promise<void> {
    if (this.query === undefined) throw new TransactionNotFoundError()
    await this.query.release()
  }

  async commit(): Promise<void> {
    if (this.query === undefined) throw new TransactionNotFoundError()
    await this.query.commitTransaction()
  }

  async rollback(): Promise<void> {
    if (this.query === undefined) throw new TransactionNotFoundError()
    await this.query.rollbackTransaction()
  }

  getRepository<Entity> (entity: ObjectType<Entity>): Repository<Entity> {
    if (this.connection === undefined) throw new ConnectionNotFoundError()
    if(this.query !== undefined) return this.query.manager.getRepository(entity)
    return getRepository(entity)
  }
}
