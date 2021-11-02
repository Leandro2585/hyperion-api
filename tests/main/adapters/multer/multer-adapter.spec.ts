import multer from 'multer'
import { mocked } from 'ts-jest/utils'
import { RequestHandler } from 'express'
import { getMockReq, getMockRes} from '@jest-mock/express'

const adaptMulter: RequestHandler = (request, response, next) => {
  const upload = multer().single('avatar')
  upload(request, response, () => {
    next()
  })
}

jest.mock('multer')

describe('multer adapter', () => {
  test('should call single upload with correct args', () => {
    const uploadSpy = jest.fn()
    const singleSpy = jest.fn().mockImplementation(() => uploadSpy)
    const multerSpy = jest.fn().mockImplementation(() => ({ single: singleSpy }))
    const fakeMulter = multer as jest.Mocked<typeof multer>
    mocked(fakeMulter).mockImplementation(multerSpy)
    const req = getMockReq()
    const res = getMockRes().res
    const next = getMockRes().next
    const sut = adaptMulter
    sut(req, res, next) 
    
    expect(multerSpy).toHaveBeenCalledWith()
    expect(multerSpy).toHaveBeenCalledTimes(1)
    expect(singleSpy).toHaveBeenCalledWith('avatar')
    expect(singleSpy).toHaveBeenCalledTimes(1)
    expect(uploadSpy).toHaveBeenCalledWith(req, res, expect.any(Function))
    expect(uploadSpy).toHaveBeenCalledTimes(1)
  })
})