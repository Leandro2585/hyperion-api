import { config } from 'aws-sdk'

class AwsS3FileStorageAdapter {
  constructor (private readonly accessKey: string, private readonly secret: string) {
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
  }
}

jest.mock('aws-sdk')

describe('aws-s3-file-storage adapter', () => {
  let accessKey: string
  let secret: string
  let sut: AwsS3FileStorageAdapter

  beforeEach(() => {
    sut = new AwsS3FileStorageAdapter(accessKey, secret)
  })

  beforeAll(() => {
    accessKey = 'any_access_key'
    secret = 'any_secret'
  })

  test('should config aws credentials on creation', () => {
    expect(sut).toBeDefined()
    expect(config.update).toHaveBeenCalledWith({
      accessKeyId: accessKey,
      secretAccessKey: secret
    })
    expect(config.update).toHaveBeenCalledTimes(1)
  })
})
