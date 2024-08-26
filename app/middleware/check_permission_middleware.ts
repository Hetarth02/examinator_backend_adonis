import Role from '#models/role'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CheckPermissionMiddleware {
  async handle(ctx: HttpContext, next: NextFn, args: any) {
    /**
     * Middleware logic goes here (before the next call)
     */

    if (!args.allowedRoles.length) {
      return ctx.response.status(500).send({
        status: false,
        message: 'Something went wrong!',
        data: null,
      })
    }

    const user = ctx.auth.getUserOrFail()
    const role = await Role.query().select('id').whereIn('name', args.allowedRoles)
    const roleArr = role.map((x) => x.id)

    if (!roleArr.includes(user.role_id)) {
      return ctx.response.status(403).send({
        status: false,
        message: 'Permission Denied!',
        data: null,
      })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    await next()
  }
}
