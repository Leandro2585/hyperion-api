import multer from 'multer'
import { RequestHandler } from 'express'

import { ServerError } from '@app/errors'

export const adaptMulter: RequestHandler = (request, response, next) => {
  const upload = multer().single('avatar')
  upload(request, response, (error) => {
    if(error !== undefined) {
      return response.status(500).json({ error: new ServerError(error).message })
    }
    if(request.file !== undefined) {
      request.locals = { 
        ...request.locals, 
        file: { 
          buffer: request.file.buffer, 
          mimeType: request.file.mimetype 
        }
      }
    }
    next()
  })
}
