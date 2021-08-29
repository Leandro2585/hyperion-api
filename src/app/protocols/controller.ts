import { HttpResponse } from './http'

export interface Controller {
  handle: (httpRequest: any) => Promise<HttpResponse>
}
