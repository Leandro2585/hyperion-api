import { mock } from 'jest-mock-extended'

import { HttpGetClient } from '@data/protocols/http'
import { FacebookApi } from '@infra/apis'

describe('facebook api', () => {
  const clientId = 'any_client_id'
  const clientSecret = 'any_client_secret'
  const grantType = 'client_credentials'

  test('should get app token', async () => {
    const httpClient = mock<HttpGetClient>()
    const sut = new FacebookApi(httpClient, clientId, clientSecret)
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: grantType
      }
    })
  })
})
