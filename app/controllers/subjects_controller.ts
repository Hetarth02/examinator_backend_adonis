import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import helper from '../helpers/helper.js'
import { createSubjectValidator, updateSubjectValidator } from '#validators/subject'
import Subject from '#models/subject'
import logger from '@adonisjs/core/services/logger'

export default class SubjectsController {
  async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createSubjectValidator)

    const trx = await db.transaction()
    try {
      const data: Partial<Subject> = {
        name: payload.name,
        class_id: payload.class_id,
      }
      await Subject.firstOrCreate(data, data, { client: trx })

      await trx.commit()
      return helper.successResponse('Success!', data)
    } catch (error) {
      logger.error(error)
      await trx.rollback()
      return response.status(500).send(helper.errorResponse())
    }
  }

  async classSubjects({ params, response }: HttpContext) {
    try {
      const data = await Subject.query()
        .select(['id', 'name', 'class_id', 'created_at'])
        .where({ class_id: params.id })
        .preload('assigned_class', (query) => {
          query.select(['id', 'name'])
        })
        .preload('assigned_teacher', (query) => {
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

      const data = await Subject.query()
        .select(['id', 'name', 'class_id', 'created_at'])
        .preload('assigned_class', (query) => {
          query.select(['id', 'name'])
        })
        .preload('assigned_teacher', (query) => {
          query.select(['id', 'name'])
        })
        .where({ id: params.id })
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

  async update({ request, response }: HttpContext) {
    const payload = await request.validateUsing(updateSubjectValidator)

    const trx = await db.transaction()
    try {
      const data = {
        name: payload.name,
      }
      await Subject.query({ client: trx }).where({ id: payload.params.id }).update(data)

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
      await Subject.query({ client: trx })
        .where({
          id: params.id,
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
