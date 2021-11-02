import 'reflect-metadata'
import { createConnection, getConnectionOptions } from 'typeorm'

import './config/module-alias'
import { app, env } from '@main/config'

createConnection()
  .then(async () => {
    const { app } = await import('@main/config')
    app.listen(env.apiPort, () => {
      console.log(`Server started at http://localhost:${env.apiPort}/`)
    })
  })
  .catch(console.error)
