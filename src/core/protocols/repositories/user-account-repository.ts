export interface LoadUserAccountRepository {
  load: (args: LoadUserAccountRepository.Input) => Promise<LoadUserAccountRepository.Output>
}

export namespace LoadUserAccountRepository {
  export type Input = {
    email: string
  }

  export type Output = undefined | {
    id: string
    name?: string
  }
}

export interface SaveFacebookAccountRepository {
  saveWithFacebook: (args: SaveFacebookAccountRepository.Input) => Promise<SaveFacebookAccountRepository.Output>
}

export namespace SaveFacebookAccountRepository {
  export type Input = {
    id?: string
    name: string
    email: string
    facebookId: string
  }

  export type Output = {
    id: string
  }
}
