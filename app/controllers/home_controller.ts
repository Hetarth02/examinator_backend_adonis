import User from '#models/user'
import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import helper from '../helpers/helper.js'

export default class HomeController {
  async login({ request }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(payload.email, payload.password)
    const token = await User.accessTokens.create(user)

    const responseData = {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      token: token.toJSON().token,
      instituteName: user.user_institute?.name ?? null,
    }
    return helper.successResponse('Success', responseData)
  }

  async logout({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    const responseData = null

    return helper.successResponse('Success!', responseData)
  }

  async profile({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    await user.load('user_institute', (query) => {
      query.select(['id', 'name'])
    })

    const responseData = {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
      instituteName: user.user_institute?.name ?? null,
    }
    return helper.successResponse('Success!', responseData)
  }
}
