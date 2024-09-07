import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import helper from '../helpers/helper.js'
import { createSubjectValidator, updateSubjectValidator } from '#validators/subject'
import Subject from '#models/subject'

export default class SubjectsController {
  async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createSubjectValidator)

    const trx = await db.transaction()
    try {
      const data: Partial<Subject> = {
        name: payload.subjectName,
        classId: payload.classId,
      }
      await Subject.firstOrCreate(data, data, { client: trx })

      await trx.commit()
      return helper.successResponse('Success!', data)
    } catch (error) {
      await trx.rollback()
      return response.status(500).send(helper.errorResponse())
    }
  }

  async list({ response }: HttpContext) {
    try {
      const data = await Subject.query().select(['id', 'name', 'created_at']).orderBy('id')

      return helper.successResponse('Success!', data)
    } catch (error) {
      return response.status(500).send(helper.errorResponse())
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      let responseData = helper.errorResponse()
      let statusCode = 404

      const data = await Subject.query()
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
    const payload = await request.validateUsing(updateSubjectValidator)

    const trx = await db.transaction()
    try {
      const data = {
        name: payload.subjectName,
      }
      await Subject.query({ client: trx }).where({ id: payload.params.id }).update(data)

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
      await Subject.query({ client: trx })
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
