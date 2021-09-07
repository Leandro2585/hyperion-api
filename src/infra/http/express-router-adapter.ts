import { RequestHandler } from 'express'
import { Controller } from '@app/protocols'

export const adaptExpressRoute = (controller: Controller): RequestHandler => {
  return async (request, response) => {
    const httpResponse = await controller.handle({ ...request.body })
    if (httpResponse.statusCode === 200) {
      response.status(200).json(httpResponse.data)
    } else {
      response.status(httpResponse.statusCode).json({ error: httpResponse.data.message })
    }
  }
}
