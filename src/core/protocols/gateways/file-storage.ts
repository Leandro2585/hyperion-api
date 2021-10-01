export interface UploadFile {
  upload: (params: UploadFile.Params) => Promise<UploadFile.Result>
}

export namespace UploadFile {
  export type Params = { file: Buffer, key: string }
  export type Result = string
}
