import { mocked } from 'ts-jest/utils'

import { ServerError } from '@app/errors'
import { Controller, HttpResponse } from '@app/protocols'
import { ValidationComposite } from '@app/validators'

jest.mock('@app/validation/composite')

class ControllerStub extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    data: 'any_data'
  }

  async execute (httpRequest: any): Promise<HttpResponse> {
    return this.result
  }
}

describe('controller', () => {
  let sut: ControllerStub

  beforeEach(() => {
    sut = new ControllerStub()
  })
  test('should return 400 if validation fails', async () => {
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy)
    const httpResponse = await sut.handle('any_value')

    expect(ValidationComposite).toHaveBeenCalledWith([])
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
    })
  })

  test('should return 500 if execute throws', async () => {
    const error = new Error('execute_error')
    jest.spyOn(sut, 'execute').mockRejectedValueOnce(error)
    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })

  test('should return same result as execute', async () => {
    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual(sut.result)
  })
})
