import { Router } from 'express'

import { auth } from '@main/middlewares'
import { adaptExpressRoute } from '@main/adapters/express'
import { makeDeleteAvatarController } from '@main/factories/controllers'

export default (router: Router): void => {
  router.delete('/users/avatar', auth, adaptExpressRoute(makeDeleteAvatarController()))
}