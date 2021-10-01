export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined | {
    id: string
    name?: string
  }
}

export interface ISaveFacebookAccountRepository {
  saveWithFacebook: (params: ISaveFacebookAccountRepository.Params) => Promise<ISaveFacebookAccountRepository.Result>
}

export namespace ISaveFacebookAccountRepository {
  export type Params = {
    id?: string
    name: string
    email: string
    facebookId: string
  }

  export type Result = {
    id: string
  }
}
