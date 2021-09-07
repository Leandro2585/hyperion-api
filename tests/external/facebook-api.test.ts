import { FacebookApi } from '@infra/apis'
import { AxiosHttpClientAdapter } from '@infra/http'
import { env } from '@main/config/env'

describe('facebook-api integration tests', () => {
  test('should return a Facebook User if token is valid', async () => {
    const axiosClient = new AxiosHttpClientAdapter()
    const sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    )
    const facebookUser = await sut.loadUser({ token: 'EAAE3ZAgN179UBAP0FMG3kbtFcYLZB5VxqXorJSSbl4gG78MYIpDOnAZAyblPbRatRnPDz3mEEU7WqZCDFxs8ZC7SpuZBjGml9D7AUBcqDmiA9OVgidsKFPY6g3DXEIZBZAaDeVuHDqEMYtHgcX9XM0Y0Q9oR2kVLmSLlxvx83ZCkn1a6tRKn8LrJfccDJZBto7SVgBVZAtwPiB1nzzoLtEsnAcF' })

    expect(facebookUser).toEqual({
      facebookId: '203799838350394',
      email: 'leo_uwvkitx_teste@tfbnw.net',
      name: 'Leo Teste'
    })
  })
})
