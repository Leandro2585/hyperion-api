import { FacebookLoginController } from '@app/controllers'
import { makeFacebookAuthenticationFactory } from '@main/factories/usecases'

export const makeFacebookLoginController = (): FacebookLoginController => {
  return new FacebookLoginController(makeFacebookAuthenticationFactory())
}
