export interface SaveUserAvatar {
  saveAvatar: (args: SaveUserAvatar.Input) => Promise<void>
}

export namespace SaveUserAvatar {
  export type Input = { id: string, avatarUrl?: string, initials?: string }
}

export interface LoadUserProfile {
  load: (args: LoadUserProfile.Input) => Promise<LoadUserProfile.Output>
}

export namespace LoadUserProfile {
  export type Input = { userId: string }
  export type Output = { name?: string }
}
