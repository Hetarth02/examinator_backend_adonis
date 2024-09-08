import Class from '#models/class'
import { createClassValidator, updateClassValidator } from '#validators/class'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import helper from '../helpers/helper.js'
import logger from '@adonisjs/core/services/logger'
import { Role } from '../helpers/enums.js'

export default class ClassesController {
  async create({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createClassValidator, {
      meta: {
        institute_id: auth.user?.institute_id,
      },
    })

    const trx = await db.transaction()
    try {
      const data: Partial<Class> = {
        name: payload.name,
      }
      if (auth.user) {
        data.institute_id = auth.user.institute_id
      }
      await Class.create(data, { client: trx })

      await trx.commit()
      return helper.successResponse('Success!', data)
    } catch (error) {
      logger.error(error)
      await trx.rollback()
      return response.status(500).send(helper.errorResponse())
    }
  }

  async list({ response, auth }: HttpContext) {
    try {
      const data = await Class.query()
        .select(['id', 'name', 'created_at'])
        .if(auth.user?.role === Role.owner || auth.user?.role === Role.teacher, (query) => {
          query.where({ institute_id: auth.user?.institute_id })
        })
        .preload('class_subject', (query) => {
          query.select(['id', 'name']).preload('assigned_teacher', (q) => {
            q.select(['id', 'name'])
          })
        })
        .orderBy('id')

      const newData: any[] = []

      if (data.length) {
        data.forEach((ele) => {
          const classSubjects: any[] = []
          ele.class_subject.forEach((obj) => {
            classSubjects.push({
              subject_id: obj.id,
              subject_name: obj.name,
              assigned_teacher: obj.assigned_teacher,
            })
          })

          newData.push({
            id: ele.id,
            name: ele.name,
            created_at: ele.created_at,
            class_subject: classSubjects,
          })
        })
      }

      return helper.successResponse('Success!', newData)
    } catch (error) {
      logger.error(error)
      return response.status(500).send(helper.errorResponse())
    }
  }

  async show({ params, response, auth }: HttpContext) {
    try {
      let responseData = helper.errorResponse('Not found!')
      let statusCode = 404

      const data = await Class.query()
        .select(['id', 'name', 'created_at'])
        .where({ id: params.id })
        .if(auth.user?.role === Role.owner, (query) => {
          query.where({ institute_id: auth.user?.institute_id })
        })
        .preload('class_subject', (query) => {
          query.select(['id', 'name']).preload('assigned_teacher', (q) => {
            q.select(['id', 'name'])
          })
        })
        .first()

      if (data) {
        const newData: any[] = []
        const classSubjects: any[] = []
        data.class_subject.forEach((obj) => {
          classSubjects.push({
            subject_id: obj.id,
            subject_name: obj.name,
            assigned_teacher: obj.assigned_teacher,
          })
        })

        newData.push({
          id: data.id,
          name: data.name,
          created_at: data.created_at,
          class_subject: classSubjects,
        })

        statusCode = 200
        responseData = helper.successResponse('Success!', newData)
      }

      return response.status(statusCode).send(responseData)
    } catch (error) {
      logger.error(error)
      return response.status(500).send(helper.errorResponse())
    }
  }

  async update({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(updateClassValidator, {
      meta: {
        institute_id: auth.user?.institute_id,
      },
    })

    const trx = await db.transaction()
    try {
      const data: Partial<Class> = {
        name: payload.name,
      }
      await Class.query({ client: trx }).where({ id: payload.params.id }).update(data)

      await trx.commit()
      return helper.successResponse('Success!', null)
    } catch (error) {
      logger.error(error)
      await trx.rollback()
      return response.status(500).send(helper.errorResponse())
    }
  }

  async delete({ params, response, auth }: HttpContext) {
    const trx = await db.transaction()
    try {
      if (auth.user) {
        await Class.query({ client: trx })
          .where({
            id: params.id,
            institute_id: auth.user.institute_id,
          })
          .del()
      }

      await trx.commit()
      return helper.successResponse('Success!', null)
    } catch (error) {
      logger.error(error)
      await trx.rollback()
      return response.status(500).send(helper.errorResponse())
    }
  }
}
