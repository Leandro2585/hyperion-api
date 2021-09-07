import { adaptExpressRoute as adaptRoute } from '@infra/http'
import { makeFacebookLoginController } from '@main/factories/controllers'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/api/login/facebook', adaptRoute(makeFacebookLoginController()))
}
