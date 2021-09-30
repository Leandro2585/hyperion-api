export interface ITokenGenerator {
  generate: (params: ITokenGenerator.Params) => Promise<ITokenGenerator.Result>
}

export namespace ITokenGenerator {
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
