import { JwtTokenAdapter } from '@infra/cryptography'
import { env } from '../../config/env'

export const makeJwtTokenFactory = (): JwtTokenAdapter => {
  return new JwtTokenAdapter(env.jwtSecret)
}
