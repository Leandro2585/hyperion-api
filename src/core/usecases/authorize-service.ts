import { ITokenValidator } from '@core/protocols/cryptography'

type Setup = (crypto: ITokenValidator) => AuthorizeService
type Input = { token: string }
type Output = string

export type AuthorizeService = (params: Input) => Promise<Output>

export const setupAuthorize: Setup = (crypto) => async (params) => {
  const key = await crypto.validateToken(params)
  return key
}
