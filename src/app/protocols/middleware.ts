import { HttpResponse } from '@app/protocols'

export interface Middleware {
  handle: (httpRequest: any) => Promise<HttpResponse>
}
