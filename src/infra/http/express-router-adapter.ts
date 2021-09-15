import { RequestHandler } from 'express'
import { Controller } from '@app/protocols'

type Adapter = (controller: Controller) => RequestHandler

export const adaptExpressRoute: Adapter = (controller) => async (request, response) => {
  const { statusCode, data } = await controller.handle({ ...request.body })
  const json = statusCode === 200
    ? data
    : { error: data.message }
  response.status(statusCode).json(json)
}
