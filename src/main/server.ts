import 'reflect-metadata'
import '@main/config/module-alias'
import { app, env } from '@main/config'

app.listen(env.apiPort, () => {
  console.log(`Server started at http://localhost:${env.apiPort}/`)
})
