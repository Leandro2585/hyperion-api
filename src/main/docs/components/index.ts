import { apiKeyAuthSchema } from '../schemas/api-key-auth-schema'
import { badRequest, serverError, forbidden, notFound, unauthorized } from './http-helpers'

export default {
  notFound,
  forbidden,
  badRequest,
  serverError,
  unauthorized,
  securitySchemas: {
    apiKeyAuth: apiKeyAuthSchema
  }
}
