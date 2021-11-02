import multer from 'multer'
import { mocked } from 'ts-jest/utils'
import { RequestHandler, Request, Response, NextFunction } from 'express'
import { getMockReq, getMockRes} from '@jest-mock/express'

const adaptMulter: RequestHandler = (request, response, next) => {
  const upload = multer().single('avatar')
  upload(request, response, () => {
    next()
  })
}

jest.mock('multer')

describe('multer adapter', () => {
  let uploadSpy: jest.Mock
  let singleSpy: jest.Mock
  let multerSpy: jest.Mock
  let fakeMulter: jest.Mocked<typeof multer>
  let req: Request
  let res: Response
  let next: NextFunction
  let sut: RequestHandler

  beforeAll(() => {
    uploadSpy = jest.fn()
    singleSpy = jest.fn().mockImplementation(() => uploadSpy)
    multerSpy = jest.fn().mockImplementation(() => ({ single: singleSpy }))
    fakeMulter = multer as jest.Mocked<typeof multer>
    mocked(fakeMulter).mockImplementation(multerSpy)
    req = getMockReq()
    res = getMockRes().res
    next = getMockRes().next
  })

  beforeEach(() => {
    sut = adaptMulter
  })

  test('should call single upload with correct args', () => {
    sut(req, res, next) 
    
    expect(multerSpy).toHaveBeenCalledWith()
    expect(multerSpy).toHaveBeenCalledTimes(1)
    expect(singleSpy).toHaveBeenCalledWith('avatar')
    expect(singleSpy).toHaveBeenCalledTimes(1)
    expect(uploadSpy).toHaveBeenCalledWith(req, res, expect.any(Function))
    expect(uploadSpy).toHaveBeenCalledTimes(1)
  })
})