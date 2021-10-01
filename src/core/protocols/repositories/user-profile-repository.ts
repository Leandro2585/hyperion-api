export interface SaveUserAvatar {
  saveAvatar: (params: SaveUserAvatar.Params) => Promise<void>
}

export namespace SaveUserAvatar {
  export type Params = { avatarUrl: string}
}
