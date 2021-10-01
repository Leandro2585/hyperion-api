export interface SaveUserAvatar {
  saveAvatar: (params: SaveUserAvatar.Params) => Promise<void>
}

export namespace SaveUserAvatar {
  export type Params = { avatarUrl?: string}
}

export interface LoadUserProfile {
  load: (params: LoadUserProfile.Params) => Promise<void>
}

export namespace LoadUserProfile {
  export type Params = { userId: string }
}
