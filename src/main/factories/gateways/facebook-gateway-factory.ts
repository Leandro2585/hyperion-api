import { FacebookGateway } from '@infra/gateways'
import { makeAxiosHttpClientFactory } from '@main/factories/http'
import { env } from '@main/config'

export const makefacebookGatewayFactory = (): FacebookGateway => {
  return new FacebookGateway(
    makeAxiosHttpClientFactory(),
    env.facebookGateway.clientId,
    env.facebookGateway.clientSecret
  )
}
