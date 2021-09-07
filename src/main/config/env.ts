export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '',
    clientSecret: process.env.FB_CLIENT_SECRET ?? ''
  },
  jwtSecret: process.env.JWT_SECRET ?? 'gfjsjhjilkbmsad',
  apiPort: process.env.API_PORT ?? 3333
}
