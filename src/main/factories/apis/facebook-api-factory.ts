import { FacebookApi } from '@infra/apis'
import { makeAxiosHttpClientFactory } from '@main/factories/http'
import { env } from '@main/config'

export const makeFacebookApiFactory = (): FacebookApi => {
  return new FacebookApi(
    makeAxiosHttpClientFactory(),
    env.facebookApi.clientId,
    env.facebookApi.clientSecret
  )
}
