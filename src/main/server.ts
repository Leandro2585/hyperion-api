import './config/module-alias'
import 'reflect-metadata'
import app from '@main/config/app'

app.listen(3333, () => {
  console.log('Server started at http://localhost:3333/')
})
