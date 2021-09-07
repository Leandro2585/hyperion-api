import { Request, Response } from 'express'
import { mock } from 'jest-mock-extended'
import { getMockReq, getMockRes } from '@jest-mock/express'

import { Controller } from '@app/protocols'

export class ExpressRouterAdapter {
  constructor (private readonly controller: Controller) {}
  async adapt (request: Request, response: Response): Promise<void> {
    await this.controller.handle({ ...request.body })
  }
}

describe('express-router adapter', () => {
  test('should call handle with correct request', async () => {
    const req = getMockReq({ body: { any: 'any' } })
    const { res } = getMockRes()
    const controller = mock<Controller>()
    const sut = new ExpressRouterAdapter(controller)
    await sut.adapt(req, res)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
  })

  test('should call handle with empty request', async () => {
    const req = getMockReq()
    const { res } = getMockRes()
    const controller = mock<Controller>()
    const sut = new ExpressRouterAdapter(controller)
    await sut.adapt(req, res)

    expect(controller.handle).toHaveBeenCalledWith({})
  })
})
