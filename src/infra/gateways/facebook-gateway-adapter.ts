import { LoadFacebookUser } from '@core/protocols/gateways'
import { HttpGetClient } from '@infra/http'

type AppToken = {
  access_token: string
}
type DebugToken = {
  data: {
    user_id: string
  }
}
type UserInfo = {
  id: string
  name: string
  email: string
}

type Input = LoadFacebookUser.Params
type Output = LoadFacebookUser.Result

export class FacebookGateway implements LoadFacebookUser {
  private readonly baseUrl = 'https://graph.facebook.com'
  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (input: Input): Promise<Output> {
    return await this.getUserInfo(input.token)
      .then(({ id, name, email }) => ({ facebookId: id, name, email }))
      .catch(() => undefined)
  }

  private async getAppToken (): Promise<AppToken> {
    return this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }

  private async getDebugToken (clientToken: string): Promise<DebugToken> {
    const appToken = await this.getAppToken()
    return this.httpClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: clientToken
      }
    })
  }

  private async getUserInfo (clientToken: string): Promise<UserInfo> {
    const debugToken = await this.getDebugToken(clientToken)
    return this.httpClient.get({
      url: `${this.baseUrl}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken
      }
    })
  }
}
