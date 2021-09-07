import { FacebookApi } from '@infra/apis'
import { AxiosHttpClientAdapter } from '@infra/http'
import { env } from '@main/config/env'

describe('facebook-api integration tests', () => {
  let axiosClient: AxiosHttpClientAdapter
  let sut: FacebookApi

  beforeEach(() => {
    axiosClient = new AxiosHttpClientAdapter()
    sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    )
  })

  test('should return a Facebook User if token is valid', async () => {
    const facebookUser = await sut.loadUser({ token: 'EAAE3ZAgN179UBAPgpDlQ1yeld4eZARCTWyAnC3iUPlzEJMOZC9xqZABJp98iIjQ0hR4jXjhpNDE5aWZBAUZAHZAV2DHRTu6OmZCHN0ZAHkbGG1QvNWgxgZAZAQk1ZBQAFDfbpJ8KFThlAG3nQZCQowjL1CrUpaxC7KU0AM6vhu5WVZAZA6jOD4UZClSZBUvI6F9COgniFsumHm4oBDa1wMuYMVDRnKa3O' })

    expect(facebookUser).toEqual({
      facebookId: '203799838350394',
      email: 'leo_uwvkitx_teste@tfbnw.net',
      name: 'Leo Teste'
    })
  })

  test('should return undefined if token is invalid', async () => {
    const facebookUser = await sut.loadUser({ token: 'invalid' })

    expect(facebookUser).toBeUndefined()
  })
})
