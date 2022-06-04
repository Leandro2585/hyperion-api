import 'reflect-metadata'

import './config/module-alias'
import { env, app } from '@main/config'
// import { PostgresConnection } from '@infra/typeorm/helpers'

// PostgresConnection.getInstance().connect()
// .then(async () => {
app.listen(env.apiPort, () => {
  console.log(`Server started at http://localhost:${env.apiPort}/`)
})
// })
// .catch(console.error)
