import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

export default (app: Express): void => {
  const router = Router()
  readdirSync(join(__dirname, '..', 'routes'))
    .filter(file => !file.endsWith('.map'))
    .map(async file => {
      (await import(`../routes/${file}`)).default(router)
    })
  app.use('/api', router)
}
