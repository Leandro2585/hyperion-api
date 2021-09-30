export interface UUIDGenerator {
  uuid: (params: UUIDGenerator.Params) => UUIDGenerator.Result
}

export namespace UUIDGenerator {
  export type Params = { key: string }
  export type Result = string
}
