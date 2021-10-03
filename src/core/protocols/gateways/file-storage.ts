export interface UploadFile {
  upload: (params: UploadFile.Params) => Promise<UploadFile.Result>
}

export namespace UploadFile {
  export type Params = { file: Buffer, key: string }
  export type Result = string
}

export interface DeleteFile {
  delete: (params: DeleteFile.Params) => Promise<void>
}

export namespace DeleteFile {
  export type Params = { key: string }
}
