import { config, S3 } from 'aws-sdk'
import { mocked } from 'ts-jest/utils'

import { UploadFile } from '@core/protocols/gateways'

export class AwsS3FileStorageAdapter {
  constructor (accessKey: string, secret: string, private readonly bucket: string) {
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
  }

  async upload ({ key, file }: UploadFile.Input): Promise<void> {
    const s3 = new S3()
    await s3.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    }).promise()
  }
}

jest.mock('aws-sdk')

describe('aws-s3-file-storage adapter', () => {
  let accessKey: string
  let secret: string
  let bucket: string
  let key: string
  let file: Buffer
  let sut: AwsS3FileStorageAdapter
  let putObjectPromiseSpy: jest.Mock
  let putObjectSpy: jest.Mock

  beforeAll(() => {
    accessKey = 'any_access_key'
    secret = 'any_secret'
    bucket = 'any_bucket'
    key = 'any_key'
    file = Buffer.from('any_buffer')
    putObjectPromiseSpy = jest.fn()
    putObjectSpy = jest.fn().mockImplementationOnce(() => ({ promise: putObjectPromiseSpy }))
    mocked(S3).mockImplementationOnce(jest.fn().mockImplementationOnce(() => ({
      putObject: putObjectSpy
    })))
  })

  beforeEach(() => {
    sut = new AwsS3FileStorageAdapter(accessKey, secret, bucket)
  })

  test('should config aws credentials on creation', () => {
    expect(sut).toBeDefined()
    expect(config.update).toHaveBeenCalledWith({
      accessKeyId: accessKey,
      secretAccessKey: secret
    })
    expect(config.update).toHaveBeenCalledTimes(1)
  })

  test('should call putObject with correct args', async () => {
    await sut.upload({ key, file })

    expect(putObjectSpy).toHaveBeenCalledWith({
      Bucket: bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    })
    expect(putObjectSpy).toHaveBeenCalledTimes(1)
    expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
  })
})
