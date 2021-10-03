import { JwtPayload, sign, verify } from 'jsonwebtoken'

import { TokenGenerator, ITokenValidator } from '@core/protocols/cryptography'

type GenerateInput = TokenGenerator.Params
type GenerateOutput = TokenGenerator.Result
type ValidateInput = ITokenValidator.Params
type ValidateOutput = ITokenValidator.Result

export class JwtTokenAdapter implements TokenGenerator, ITokenValidator {
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
