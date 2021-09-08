import axios from 'axios'

import { HttpGetClient } from '@infra/http'

type Params = HttpGetClient.Params

export class AxiosHttpClientAdapter implements HttpGetClient {
  async get ({ url, params }: Params): Promise<any> {
    const response = await axios.get(url, { params })
    return response.data
  }
}
