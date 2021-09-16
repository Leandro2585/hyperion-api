export interface ITokenValidator {
  validateToken: (params: ITokenValidator.Params) => Promise<ITokenValidator.Result>
}

export namespace ITokenValidator {
  export type Params = { token: string }
  export type Result = string
}
