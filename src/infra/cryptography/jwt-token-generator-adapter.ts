import { sign } from 'jsonwebtoken'

import { ITokenGenerator } from '@data/protocols/cryptography'

export class JwtTokenGeneratorAdapter implements ITokenGenerator {
  constructor (private readonly secret: string) {}
  async generateToken (params: ITokenGenerator.Params): Promise<ITokenGenerator.Result> {
    const expirationInSeconds = params.expirationInMs / 1000
    return sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds })
  }
}
