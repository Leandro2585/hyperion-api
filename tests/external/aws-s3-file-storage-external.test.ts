import axios from 'axios'

import { AwsS3FileStorageAdapter } from '@infra/gateways'
import { env } from '@main/config'

describe('aws-s3-file-storage integration tests', () => {
  let sut: AwsS3FileStorageAdapter
  
  beforeEach(() => {
    sut = new AwsS3FileStorageAdapter(env.s3.accessKey, env.s3.secret, env.s3.bucket)
  })

  test('should upload and delete image from aws S3', async () => {
    const file = Buffer.from('any_buffer', 'base64')
    const fileName = 'any_file_name.png'
    const avatarUrl = await sut.upload({ fileName, file })
  
    expect((await axios.get(avatarUrl)).status).toBe(200)

    await sut.delete({ fileName })

    await expect(axios.get(avatarUrl)).rejects.toThrow()
  })
})