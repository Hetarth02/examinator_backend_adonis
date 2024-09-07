import User from '#models/user'
import { createTeacherValidator, updateTeacherValidator } from '#validators/teacher'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'
import helper from '../helpers/helper.js'
import { Role } from '../helpers/enums.js'
import TeacherAssignedSubject from '#models/teacher_assigned_subject'

export default class TeachersController {
  async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createTeacherValidator)

    const trx = await db.transaction()
    try {
      const data: Partial<User> = {
        email: payload.email,
        password: payload.password,
        full_name: payload.fullName,
        institute_id: payload.instituteId,
        role: Role.teacher,
      }
      const user = await User.create(data, { client: trx })

      const assignData: Partial<TeacherAssignedSubject>[] = []
      payload.subjectsId.forEach((ele: number) => {
        assignData.push({
          teacher_id: user.id,
          subject_id: ele,
        })
      })
      await TeacherAssignedSubject.createMany(assignData, { client: trx })

      await trx.commit()
      return helper.successResponse('Success!', data)
    } catch (error) {
      await trx.rollback()
      return response.status(500).send(helper.errorResponse())
    }
  }

  async list({ response }: HttpContext) {
    try {
      const data = await User.query()
        .select(['id', 'full_name', 'email', 'created_at'])
        .where('role', Role.teacher)
        .preload('user_institute', (query) => {
          query.select(['id', 'name'])
        })
        .preload('user_subject', (query) => {
          query.select(['id', 'name'])
        })
        .orderBy('id')

      return helper.successResponse('Success!', data)
    } catch (error) {
      return response.status(500).send(helper.errorResponse())
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      let responseData = helper.errorResponse()
      let statusCode = 404

      const data = await User.query()
        .select(['id', 'full_name', 'email', 'created_at'])
        .where({ id: params.id, role: Role.teacher })
        .preload('user_institute', (query) => {
          query.select(['id', 'name'])
        })
        .preload('user_subject', (query) => {
          query.select(['id', 'name'])
        })
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

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateTeacherValidator, {
      meta: {
        userId: params.id,
      },
    })

    const trx = await db.transaction()
    try {
      const data: Partial<User> = {
        email: payload.email,
        full_name: payload.fullName,
      }
      if (payload.password) {
        data.password = await hash.make(payload.password)
      }
      await User.query({ client: trx })
        .where({ id: payload.params.id, role: Role.teacher })
        .update(data)

      await TeacherAssignedSubject.query({ client: trx })
        .where({
          teacher_id: payload.params.id,
        })
        .del()

      const assignData: Partial<TeacherAssignedSubject>[] = []
      payload.subjectsId.forEach((ele: number) => {
        assignData.push({
          teacher_id: payload.params.id,
          subject_id: ele,
        })
      })
      await TeacherAssignedSubject.createMany(assignData, { client: trx })
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
      await User.query({ client: trx })
        .where({
          id: params.id,
          role: Role.teacher,
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
