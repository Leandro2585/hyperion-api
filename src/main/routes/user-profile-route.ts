import { Router } from 'express'

import { auth } from '@main/middlewares'
import { adaptMulter } from '@main/adapters/multer'
import { adaptExpressRoute } from '@main/adapters/express'
import { makeDeleteAvatarController, makeSaveAvatarController } from '@main/factories/controllers'

export default (router: Router): void => {
  router.delete('/users/avatar', auth, adaptExpressRoute(makeDeleteAvatarController()))
  router.put('/users/avatar', auth, adaptMulter, adaptExpressRoute(makeSaveAvatarController()))
}
