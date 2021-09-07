import { Request, Response } from 'express'
import { mock, MockProxy } from 'jest-mock-extended'
import { getMockReq, getMockRes } from '@jest-mock/express'

import { Controller } from '@app/protocols'

export class ExpressRouterAdapter {
  constructor (private readonly controller: Controller) {}
  async adapt (request: Request, response: Response): Promise<void> {
    await this.controller.handle({ ...request.body })
  }
}

describe('express-router adapter', () => {
  let req: Request
  let res: Response
  let controller: MockProxy<Controller>
  let sut: ExpressRouterAdapter

  beforeEach(() => {
    req = getMockReq({ body: { any: 'any' } })
    res = getMockRes().res
    controller = mock()
    sut = new ExpressRouterAdapter(controller)
  })

  test('should call handle with correct request', async () => {
    await sut.adapt(req, res)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
  })

  test('should call handle with empty request', async () => {
    const req = getMockReq()
    await sut.adapt(req, res)

    expect(controller.handle).toHaveBeenCalledWith({})
  })
})
