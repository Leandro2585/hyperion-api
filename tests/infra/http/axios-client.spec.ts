import axios from 'axios'

import { HttpGetClient } from '@infra/http'

jest.mock('axios')

export class AxiosHttpClient {
  async get (args: HttpGetClient.Params): Promise<any> {
    const response = await axios.get(args.url, { params: args.params })
    return response.data
  }
}

describe('axios-http client', () => {
  let sut: AxiosHttpClient
  let fakeAxios: jest.Mocked<typeof axios>
  let url: string
  let params: object

  beforeAll(() => {
    url = 'any_url'
    params = { any: 'any' }
    fakeAxios = axios as jest.Mocked<typeof axios>
    fakeAxios.get.mockResolvedValue({ status: 200, data: 'any_data' })
  })
  beforeEach(() => {
    sut = new AxiosHttpClient()
  })

  describe('GET', () => {
    test('should call GET with correct params', async () => {
      await sut.get({ url, params })

      expect(fakeAxios.get).toHaveBeenCalledWith(url, { params })
      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })

    test('should return data on success', async () => {
      const response = await sut.get({ url, params })

      expect(response).toEqual('any_data')
    })
  })
})
