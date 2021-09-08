import { RequestHandler } from 'express'
import { Controller } from '@app/protocols'

export const adaptExpressRoute = (controller: Controller): RequestHandler => {
  return async (request, response) => {
    const { statusCode, data } = await controller.handle({ ...request.body })
    const json = statusCode === 200
      ? data
      : { error: data.message }
    response.status(statusCode).json(json)
  }
}
