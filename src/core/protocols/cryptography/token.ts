export interface TokenGenerator {
  generate: (args: TokenGenerator.Input) => Promise<TokenGenerator.Output>
}

export namespace TokenGenerator {
  export type Input = {
    key: string
    expirationInMs: number
  }
  export type Output = string
}

export interface TokenValidator {
  validate: (args: TokenValidator.Input) => Promise<TokenValidator.Output>
}

export namespace TokenValidator {
  export type Input = { token: string }
  export type Output = string
}
