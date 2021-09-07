import { Request, Response } from 'express'
import { Controller } from '@app/protocols'

export class ExpressRouterAdapter {
  constructor (private readonly controller: Controller) {}
  async adapt (request: Request, response: Response): Promise<void> {
    const httpResponse = await this.controller.handle({ ...request.body })
    if (httpResponse.statusCode === 200) {
      response.status(200).json(httpResponse.data)
    } else {
      response.status(httpResponse.statusCode).json({ error: httpResponse.data.message })
    }
  }
}
