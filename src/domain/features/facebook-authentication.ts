import { AuthenticationError } from '@domain/errors'
import { AccessToken } from '@domain/models'

export interface FacebookAuthentication {
  execute: (params: FacebookAuthentication.Params) => Promise<void>
}

export namespace FacebookAuthentication {
  export type Params = {
    token: string
  }

  export type Result = AccessToken | AuthenticationError
}
