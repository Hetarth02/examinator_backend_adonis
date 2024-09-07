import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import helper from '../helpers/helper.js'

export default class CheckPermissionMiddleware {
  async handle(ctx: HttpContext, next: NextFn, args: any) {
    /**
     * Middleware logic goes here (before the next call)
     */

    if (!args.allowedRoles.length) {
      return ctx.response.status(500).send(helper.errorResponse())
    }

    const user = ctx.auth.getUserOrFail()
    if (!args.allowedRoles.includes(user.role)) {
      return ctx.response.status(403).send(helper.errorResponse('Permission Denied!'))
    }

    /**
     * Call next method in the pipeline and return its output
     */
    return await next()
  }
}
