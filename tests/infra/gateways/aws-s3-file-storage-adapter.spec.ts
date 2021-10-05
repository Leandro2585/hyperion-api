import { config } from 'aws-sdk'

class AwsS3FileStorageAdapter {
  constructor (private readonly accessKey: string, private readonly secret: string) {
    config.update({
      credentials: {
        accessKeyId: '',
        secretAccessKey: ''
      }
    })
  }
}

jest.mock('aws-sdk')

describe('aws-s3-file-storage adapter', () => {
  test('should config aws credentials on creation', () => {
    const accessKey = 'any_access_key'
    const secret = 'any_secret'
    const sut = new AwsS3FileStorageAdapter(accessKey, secret)

    expect(sut).toBeDefined()
    expect(config.update).toHaveBeenCalledWith({
      accessKeyId: accessKey,
      secretAccessKey: secret
    })
    expect(config.update).toHaveBeenCalledTimes(1)
  })
})
