export interface UUIDGenerator {
  uuid: (args: UUIDGenerator.Input) => UUIDGenerator.Output
}

export namespace UUIDGenerator {
  export type Input = { key: string }
  export type Output = string
}
