import { Controller } from '@app/protocols';
import { DatabaseTransactionDecorator } from '@app/decorators';
import { makePostgresConnection } from '@main/factories/connection'

export const makePostgresTransactionDecorator = (controller: Controller): DatabaseTransactionDecorator => {
  return new DatabaseTransactionDecorator(controller, makePostgresConnection())
}