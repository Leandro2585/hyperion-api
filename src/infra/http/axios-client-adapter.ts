import axios from 'axios'

import { HttpGetClient } from '@infra/http'

type Input = HttpGetClient.Params

export class AxiosHttpClientAdapter implements HttpGetClient {
  async get ({ url, params }: Input): Promise<any> {
    const response = await axios.get(url, { params })
    return response.data
  }
}
