import axios from 'axios'

import { AxiosHttpClient } from '@infra/http'

jest.mock('axios')

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

    test('should rethrow if get throws', async () => {
      fakeAxios.get.mockRejectedValueOnce(new Error('http_error'))
      const promise = sut.get({ url, params })

      await expect(promise).rejects.toThrow(new Error('http_error'))
    })
  })
})
