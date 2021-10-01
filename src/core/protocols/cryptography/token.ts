export interface TokenGenerator {
  generate: (params: TokenGenerator.Params) => Promise<TokenGenerator.Result>
}

export namespace TokenGenerator {
  export type Params = {
    key: string
    expirationInMs: number
  }
  export type Result = string
}

export interface ITokenValidator {
  validate: (params: ITokenValidator.Params) => Promise<ITokenValidator.Result>
}

export namespace ITokenValidator {
  export type Params = { token: string }
  export type Result = string
}
