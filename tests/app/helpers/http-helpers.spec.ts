import { ForbiddenError, ServerError, UnauthorizedError } from '@app/errors'
import { ok, badRequest, unauthorized, serverError, forbidden, noContent } from '@app/helpers/http-helpers'

describe('http helpers', () => {
  test('should return 200 with correct data on ok', () => {
    const sut = ok({ any: 'any' })

    expect(sut.statusCode).toBe(200)
    expect(sut.data).toEqual({ any: 'any' })
  })

  test('should return 204 with null on noContent', () => {
    const sut = noContent()

    expect(sut.statusCode).toBe(204)
    expect(sut.data).toEqual(null)
  })

  test('should return 400 with error on badRequest', () => {
    const error = new Error('request_error')
    const sut = badRequest(error)

    expect(sut.statusCode).toBe(400)
    expect(sut.data).toEqual(error)
  })

  test('should return 401 with UnauthorizedError on unauthorized', () => {
    const sut = unauthorized()

    expect(sut.statusCode).toBe(401)
    expect(sut.data).toEqual(new UnauthorizedError())
  })

  test('should return 403 with ForbiddenError on forbidden', () => {
    const sut = forbidden()

    expect(sut.statusCode).toBe(403)
    expect(sut.data).toEqual(new ForbiddenError())
  })

  test('should return 500 with ServerError on serverError', () => {
    const error = new Error('request_error')
    const sut = serverError(error)

    expect(sut.statusCode).toBe(500)
    expect(sut.data).toEqual(new ServerError(error))
  })

  test('should return 500 with undefined on serverError without instance of Error', () => {
    const error = 'request_error'
    const sut = serverError(error)

    expect(sut.statusCode).toBe(500)
    expect(sut.data).toEqual(new ServerError(undefined))
  })
})
