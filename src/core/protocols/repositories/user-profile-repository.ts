export interface SaveUserAvatar {
  saveAvatar: (params: SaveUserAvatar.Params) => Promise<void>
}

export namespace SaveUserAvatar {
  export type Params = { id: string, avatarUrl?: string, initials?: string }
}

export interface LoadUserProfile {
  load: (params: LoadUserProfile.Params) => Promise<LoadUserProfile.Result>
}

export namespace LoadUserProfile {
  export type Params = { userId: string }
  export type Result = { name?: string }
}
