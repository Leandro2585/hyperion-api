import { sign } from 'jsonwebtoken'

import { ITokenGenerator } from '@domain/protocols/cryptography'

type Params = ITokenGenerator.Params
type Result = ITokenGenerator.Result

export class JwtTokenGeneratorAdapter implements ITokenGenerator {
  constructor (private readonly secret: string) {}
  async generateToken ({ key, expirationInMs }: Params): Promise<Result> {
    const expirationInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }
}
