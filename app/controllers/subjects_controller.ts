import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import helper from '../helpers/helper.js'
import { createSubjectValidator, updateSubjectValidator } from '#validators/subject'
import Subject from '#models/subject'
import logger from '@adonisjs/core/services/logger'
import TeacherAssignedSubject from '#models/teacher_assigned_subject'

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
        .where({ class_id: Number.parseInt(params.id) })
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

  async assignedSubjects({ response, auth }: HttpContext) {
    try {
      const data = await TeacherAssignedSubject.query()
        .where({ teacher_id: auth.user?.id })
        .preload('assigned_subject', (query) => {
          query.select(['id', 'name', 'class_id']).preload('assigned_class', (q) => {
            q.select(['id', 'name'])
          })
        })
        .orderBy('id')

      const newData: any[] = []

      if (data.length) {
        data.forEach((subject) => {
          newData.push({
            subject_id: subject.subject_id,
            subject_name: subject.assigned_subject.name,
            class_id: subject.assigned_subject.class_id,
            class_name: subject.assigned_subject.assigned_class.name,
          })
        })
      }

      return helper.successResponse('Success!', newData)
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
