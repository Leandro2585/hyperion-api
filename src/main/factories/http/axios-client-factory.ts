import { AxiosHttpClientAdapter } from '@infra/http'

export const makeAxiosHttpClientFactory = (): AxiosHttpClientAdapter => {
  return new AxiosHttpClientAdapter()
}
