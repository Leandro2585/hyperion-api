import { sign } from 'jsonwebtoken'

import { ITokenGenerator } from '@data/protocols/cryptography'

type GenerateParams = ITokenGenerator.Params
type GenerateResult = ITokenGenerator.Result

export class JwtTokenGeneratorAdapter implements ITokenGenerator {
  constructor (private readonly secret: string) {}
  async generateToken ({ key, expirationInMs }: GenerateParams): Promise<GenerateResult> {
    const expirationInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }
}
