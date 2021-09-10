import 'reflect-metadata'
import { createConnection } from 'typeorm'

import '@main/config/module-alias'
import { app, env } from '@main/config'

createConnection('default')
  .then(() => {
    app.listen(env.apiPort, () => {
      console.log(`Server started at http://localhost:${env.apiPort}/`)
    })
  }).catch(console.error)
