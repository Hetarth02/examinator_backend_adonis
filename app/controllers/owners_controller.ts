import Institute from '#models/institute'
import User from '#models/user'
import { createOwnerValidator, updateOwnerValidator } from '#validators/owner'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'
import helper from '../helpers/helper.js'
import { Role } from '../helpers/enums.js'
import logger from '@adonisjs/core/services/logger'

export default class OwnersController {
  async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createOwnerValidator)

    const trx = await db.transaction()
    try {
      const institute = await Institute.firstOrCreate(
        { name: payload.institute_name },
        { name: payload.institute_name }
      )

      const data: Partial<User> = {
        role: Role.owner,
        email: payload.email,
        institute_id: institute.id,
        password: payload.password,
        name: payload.name,
      }
      await User.create(data, { client: trx })

      await trx.commit()
      return helper.successResponse('Success!', data)
    } catch (error) {
      logger.error(error)
      await trx.rollback()
      return response.status(500).send(helper.errorResponse())
    }
  }

  async list({ response }: HttpContext) {
    try {
      const data = await User.query()
        .select(['id', 'name', 'email', 'institute_id', 'created_at'])
        .where('role', Role.owner)
        .preload('user_institute', (query) => {
          query.select(['id', 'name'])
        })
        .orderBy('id')

      return helper.successResponse('Success!', data)
    } catch (error) {
      logger.error(error)
      return response.status(500).send(helper.errorResponse())
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      let responseData = helper.errorResponse('Not found!')
      let statusCode = 404

      const data = await User.query()
        .select(['id', 'name', 'email', 'institute_id', 'created_at'])
        .where({ id: params.id, role: Role.owner })
        .preload('user_institute', (query) => {
          query.select(['id', 'name'])
        })
        .first()

      if (data) {
        statusCode = 200
        responseData = helper.successResponse('Success!', data)
      }

      return response.status(statusCode).send(responseData)
    } catch (error) {
      logger.error(error)
      return response.status(500).send(helper.errorResponse())
    }
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateOwnerValidator, {
      meta: {
        userId: params.id,
      },
    })

    const trx = await db.transaction()
    try {
      const institute = await Institute.firstOrCreate(
        { name: payload.institute_name },
        { name: payload.institute_name }
      )

      const data: Partial<User> = {
        email: payload.email,
        institute_id: institute.id,
        name: payload.name,
      }
      if (payload.password) {
        data.password = await hash.make(payload.password)
      }

      await User.query({ client: trx })
        .where({ id: payload.params.id, role: Role.owner })
        .update(data)
      await trx.commit()

      return helper.successResponse('Success!', null)
    } catch (error) {
      logger.error(error)
      await trx.rollback()
      return response.status(500).send(helper.errorResponse())
    }
  }

  async delete({ params, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      await User.query({ client: trx })
        .where({
          id: params.id,
          role: Role.owner,
        })
        .del()

      await trx.commit()
      return helper.successResponse('Success!', null)
    } catch (error) {
      logger.error(error)
      await trx.rollback()
      return response.status(500).send(helper.errorResponse())
    }
  }
}
