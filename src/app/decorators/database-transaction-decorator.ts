import { Controller, DatabaseTransaction, HttpResponse } from '@app/protocols'

export class DatabaseTransactionDecorator extends Controller {
  constructor (
    private readonly decoratee: Controller,
    private readonly database: DatabaseTransaction
  ) { super() }

  async execute (httpRequest: any): Promise<HttpResponse> {
    await this.database.openTransaction()
    try {
      const httpResponse = await this.decoratee.execute(httpRequest)
      await this.database.commit()
      return httpResponse
    } catch (error) {
      await this.database.rollback()
      throw error
    } finally {
      await this.database.closeTransaction()
    }
  }
}
