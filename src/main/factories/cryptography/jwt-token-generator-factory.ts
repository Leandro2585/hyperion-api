import { JwtTokenGeneratorAdapter } from '@infra/cryptography'
import { env } from '@main/config'

export const makeJwtTokenGeneratorFactory = (): JwtTokenGeneratorAdapter => {
  return new JwtTokenGeneratorAdapter(env.jwtSecret)
}
