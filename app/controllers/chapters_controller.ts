import Chapter from '#models/chapter'
import { createChapterValidator, updateChapterValidator } from '#validators/chapter'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import db from '@adonisjs/lucid/services/db'
import helper from '../helpers/helper.js'

export default class ChaptersController {
  async create({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createChapterValidator)

    const trx = await db.transaction()
    try {
      const data: Partial<Chapter> = {
        name: payload.name,
        subject_id: payload.subject_id,
        content_type: payload.content_type,
        content: payload.content,
      }
      if (auth.user) {
        data.user_id = auth.user.id
      }
      await Chapter.create(data, { client: trx })

      await trx.commit()
      return helper.successResponse('Success!', data)
    } catch (error) {
      logger.error(error)
      await trx.rollback()
      return response.status(500).send(helper.errorResponse())
    }
  }

  async subjectChapters({ params, response }: HttpContext) {
    try {
      const data = await Chapter.query()
        .select(['id', 'name', 'content_type', 'content', 'created_at'])
        .where({ subject_id: params.id })
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

      const data = await Chapter.query()
        .select(['id', 'user_id', 'subject_id', 'name', 'content_type', 'content', 'created_at'])
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

  async update({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(updateChapterValidator)

    const trx = await db.transaction()
    try {
      const data: Partial<Chapter> = {
        name: payload.name,
        subject_id: payload.subject_id,
        content_type: payload.content_type,
        content: payload.content,
      }
      if (auth.user) {
        data.user_id = auth.user.id
      }
      await Chapter.query({ client: trx }).where({ id: payload.params.id }).update(data)

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
      await Chapter.query({ client: trx })
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
