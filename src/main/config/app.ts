import express from 'express'
import { setupMiddlewares, setupRoutes } from '@main/config'

const app = express()

setupMiddlewares(app)
setupRoutes(app)

export { app }
