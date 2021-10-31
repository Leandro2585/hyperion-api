import { AwsS3FileStorageAdapter } from '@infra/gateways';
import { env } from '@main/config';

export const makeAwsS3FileStorage = (): AwsS3FileStorageAdapter => {
  return new AwsS3FileStorageAdapter(
    env.s3.accessKey,
    env.s3.secret,
    env.s3.bucket
  )
}