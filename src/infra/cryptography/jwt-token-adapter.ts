import { JwtPayload, sign, verify } from 'jsonwebtoken'

import { TokenGenerator, ITokenValidator } from '@core/protocols/cryptography'

type GenerateParams = TokenGenerator.Params
type GenerateResult = TokenGenerator.Result
type ValidateParams = ITokenValidator.Params
type ValidateResult = ITokenValidator.Result

export class JwtTokenAdapter implements TokenGenerator, ITokenValidator {
  constructor (private readonly secret: string) {}
  async generate ({ key, expirationInMs }: GenerateParams): Promise<GenerateResult> {
    const expirationInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }

  async validate (params: ValidateParams): Promise<ValidateResult> {
    const payload = verify(params.token, this.secret) as JwtPayload
    return payload.key
  }
}
