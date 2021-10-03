import { JwtPayload, sign, verify } from 'jsonwebtoken'

import { TokenGenerator, TokenValidator } from '@core/protocols/cryptography'

type GenerateInput = TokenGenerator.Input
type GenerateOutput = TokenGenerator.Output
type ValidateInput = TokenValidator.Input
type ValidateOutput = TokenValidator.Output

export class JwtTokenAdapter implements TokenGenerator, TokenValidator {
  constructor (private readonly secret: string) {}
  async generate ({ key, expirationInMs }: GenerateInput): Promise<GenerateOutput> {
    const expirationInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }

  async validate ({ token }: ValidateInput): Promise<ValidateOutput> {
    const payload = verify(token, this.secret) as JwtPayload
    return payload.key
  }
}
