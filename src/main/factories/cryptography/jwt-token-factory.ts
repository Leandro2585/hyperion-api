import { JwtTokenAdapter } from '@infra/cryptography'
import { env } from '@main/config'

export const makeJwtTokenFactory = (): JwtTokenAdapter => {
  return new JwtTokenAdapter(env.jwtSecret)
}
