export interface ITokenGenerator {
  generateToken: (params: ITokenGenerator.Params) => Promise<ITokenGenerator.Result>
}

export namespace ITokenGenerator {
  export type Params = {
    key: string
    expirationInMs: number
  }
  export type Result = string
}
