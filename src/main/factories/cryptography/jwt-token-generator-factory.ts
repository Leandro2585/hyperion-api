import { JwtTokenAdapter } from '@infra/cryptography'
import { env } from '@main/config'

export const makeJwtTokenGeneratorFactory = (): JwtTokenAdapter => {
  return new JwtTokenAdapter(env.jwtSecret)
}
