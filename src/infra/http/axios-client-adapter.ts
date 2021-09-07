import axios from 'axios'

import { HttpGetClient } from '@infra/http'

type GetParams = HttpGetClient.Params

export class AxiosHttpClientAdapter implements HttpGetClient {
  async get ({ url, params }: GetParams): Promise<any> {
    const response = await axios.get(url, { params })
    return response.data
  }
}
