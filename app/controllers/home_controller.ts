import User from '#models/user'
import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async login({ request }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(payload.email, payload.password)
    user.load('user_role')
    const token = await User.accessTokens.create(user)
    return {
      status: true,
      message: 'Success',
      result: token,
    }
  }

  async logout({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return {
      status: true,
      message: 'Success',
      data: null,
    }
  }

  async profile({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    await user.load('user_role')

    return {
      status: true,
      message: 'Success',
      data: user,
    }
  }
}
