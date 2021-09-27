import { JwtPayload, sign, verify } from 'jsonwebtoken'

import { ITokenGenerator, ITokenValidator } from '@core/protocols/cryptography'

type GenerateParams = ITokenGenerator.Params
type GenerateResult = ITokenGenerator.Result
type ValidateParams = ITokenValidator.Params
type ValidateResult = ITokenValidator.Result

export class JwtTokenAdapter implements ITokenGenerator, ITokenValidator {
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
