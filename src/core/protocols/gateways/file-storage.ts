export interface UploadFile {
  upload: (params: UploadFile.Params) => Promise<void>
}

export namespace UploadFile {
  export type Params = { file: Buffer, key: string }
}
