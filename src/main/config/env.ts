export const env = {
  facebookGateway: {
    clientId: process.env.FB_CLIENT_ID ?? '',
    clientSecret: process.env.FB_CLIENT_SECRET ?? ''
  },
  s3: {
    accessKey: process.env.AWS_ACCESS_KEY ?? '',
    secret: process.env.AWS_SECRET ?? '',
    bucket: process.env.AWS_BUCKET ?? ''
  },
  jwtSecret: process.env.JWT_SECRET ?? 'gfjsjhjilkbmsad',
  apiPort: process.env.API_PORT ?? 3333
}
