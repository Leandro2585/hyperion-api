export interface ILoadFacebookUser {
  loadUser: (params: ILoadFacebookUser.Params) => Promise<ILoadFacebookUser.Result>
}

export namespace ILoadFacebookUser {
  export type Params = {
    token: string
  }
  export type Result = undefined | {
    facebookId: string
    name: string
    email: string
  }
}
