import 'reflect-metadata'
import { createConnection, getConnectionOptions } from 'typeorm'

import './config/module-alias'
import { app, env } from '@main/config'

getConnectionOptions()
  .then(async (options) => {
    const root = process.env.TS_NODE_DEV === undefined ? 'dist' : 'src'
    const entities = [`${root}/infra/typeorm/entities/entities/index.{js,ts}`]
    await createConnection({ ...options, entities })
    const { app } = await import('@main/config')
    app.listen(env.apiPort, () => {
      console.log(`Server started at http://localhost:${env.apiPort}/`)
    })
  })
  .catch(console.error)
