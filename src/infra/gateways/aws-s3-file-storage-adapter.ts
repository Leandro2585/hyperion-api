import { config, S3 } from 'aws-sdk'

import { UploadFile, DeleteFile } from '@core/protocols/gateways'

export class AwsS3FileStorageAdapter implements UploadFile, DeleteFile {
  private readonly client: S3
  constructor (accessKey: string, secret: string, private readonly bucket: string) {
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
    this.client = new S3()
  }

  async upload ({ fileName, file }: UploadFile.Input): Promise<UploadFile.Output> {
    await this.client.putObject({
      Bucket: this.bucket,
      Key: fileName,
      Body: file,
      ACL: 'public-read'
    }).promise()
    return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(fileName)}`
  }

  async delete ({ fileName }: DeleteFile.Input): Promise<void> {
    await this.client.deleteObject({
      Bucket: this.bucket,
      Key: fileName
    }).promise()
  }
}
