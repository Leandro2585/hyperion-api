import { HttpResponse } from '@app/protocols'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  data: error
})
