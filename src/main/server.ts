import './config/module-alias'
import 'reflect-metadata'
import express from 'express'

const app = express()

app.listen(3333, () => {
  console.log('Server started at http://localhost:3333/')
})
