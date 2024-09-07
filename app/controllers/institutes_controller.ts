import Institute from '#models/institute'
import { createInstituteValidator, updateInstituteValidator } from '#validators/institute'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import helper from '../helpers/helper.js'

export default class InstitutesController {
  async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createInstituteValidator)

    const trx = await db.transaction()
    try {
      const data = {
        name: payload.instituteName,
      }
      await Institute.create(data, { client: trx })

      await trx.commit()
      return helper.successResponse('Success!', data)
    } catch (error) {
      await trx.rollback()
      return response.status(500).send(helper.errorResponse())
    }
  }

  async list({ response }: HttpContext) {
    try {
      const data = await Institute.query().select(['id', 'name', 'created_at']).orderBy('id')

      return helper.successResponse('Success!', data)
    } catch (error) {
      return response.status(500).send(helper.errorResponse())
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      let responseData = helper.errorResponse()
      let statusCode = 404

      const data = await Institute.query()
        .select(['id', 'name', 'created_at'])
        .where({ id: params.id })
        .first()

      if (data) {
        statusCode = 200
        responseData = helper.successResponse('Success!', data)
      }

      return response.status(statusCode).send(responseData)
    } catch (error) {
      return response.status(500).send(helper.errorResponse())
    }
  }

  async update({ request, response }: HttpContext) {
    const payload = await request.validateUsing(updateInstituteValidator)

    const trx = await db.transaction()
    try {
      const data = {
        name: payload.instituteName,
      }
      await Institute.query({ client: trx }).where({ id: payload.params.id }).update(data)

      await trx.commit()
      return helper.successResponse('Success!', null)
    } catch (error) {
      await trx.rollback()
      return response.status(500).send(helper.errorResponse())
    }
  }

  async delete({ params, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      await Institute.query({ client: trx })
        .where({
          id: params.id,
        })
        .del()

      await trx.commit()
      return helper.successResponse('Success!', null)
    } catch (error) {
      await trx.rollback()
      return response.status(500).send(helper.errorResponse())
    }
  }
}
