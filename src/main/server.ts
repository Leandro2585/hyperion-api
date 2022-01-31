import 'reflect-metadata'

import './config/module-alias'
import { env } from '@main/config'
import { PostgresConnection } from '@infra/typeorm/helpers'

PostgresConnection.getInstance().connect()
  .then(async () => {
    const { app } = await import('@main/config')
    app.listen(env.apiPort, () => {
      console.log(`Server started at http://localhost:${env.apiPort}/`)
    })
  })
  .catch(console.error)
