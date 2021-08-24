import axios from 'axios'

import { HttpGetClient } from '@infra/http'

export class AxiosHttpClientAdapter implements HttpGetClient {
  async get (args: HttpGetClient.Params): Promise<any> {
    const response = await axios.get(args.url, { params: args.params })
    return response.data
  }
}
