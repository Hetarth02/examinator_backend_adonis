import User from '#models/user'
import { createTeacherValidator, updateTeacherValidator } from '#validators/teacher'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'
import helper from '../helpers/helper.js'
import { Role } from '../helpers/enums.js'
import TeacherAssignedSubject from '#models/teacher_assigned_subject'
import logger from '@adonisjs/core/services/logger'

export default class TeachersController {
  async create({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createTeacherValidator)

    const trx = await db.transaction()
    try {
      const data: Partial<User> = {
        email: payload.email,
        password: payload.password,
        name: payload.name,
        role: Role.teacher,
      }
      if (auth.user) {
        data.institute_id = auth.user.institute_id
      }
      const user = await User.create(data, { client: trx })

      const assignData: Partial<TeacherAssignedSubject>[] = []
      payload.subject_ids.forEach((ele: number) => {
        assignData.push({
          teacher_id: user.id,
          subject_id: ele,
        })
      })
      await TeacherAssignedSubject.createMany(assignData, { client: trx })

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
      const data = await User.query()
        .select(['id', 'name', 'email', 'institute_id', 'created_at'])
        .where('role', Role.teacher)
        .if(auth.user?.role === Role.owner, (query) => {
          query.where({ institute_id: auth.user?.institute_id })
        })
        .preload('user_institute', (query) => {
          query.select(['id', 'name'])
        })
        .preload('user_subject', (query) => {
          query.select(['id', 'name', 'class_id']).preload('assigned_class', (q) => {
            q.select(['id', 'name'])
          })
        })
        .orderBy('id')

      const newData: any[] = []
        console.log(data)
      if (data.length) {
        data.forEach((ele) => {
          const userSubjects: any[] = []
          ele.user_subject.forEach((subject) => {
            userSubjects.push({
              subject_id: subject.id,
              subject_name: subject.name,
              class_id: subject.class_id,
              class_name: subject.assigned_class.name,
            })
          })

          newData.push({
            id: ele.id,
            name: ele.name,
            email: ele.email,
            institute_id: ele.institute_id,
            institute_name: ele.user_institute.name,
            created_at: ele.created_at,
            user_subject: userSubjects,
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

      const data = await User.query()
        .select(['id', 'name', 'email', 'institute_id', 'created_at'])
        .where({ id: params.id, role: Role.teacher })
        .if(auth.user?.role === Role.owner, (query) => {
          query.where({ institute_id: auth.user?.institute_id })
        })
        .preload('user_institute', (query) => {
          query.select(['id', 'name'])
        })
        .preload('user_subject', (query) => {
          query.select(['id', 'name', 'class_id']).preload('assigned_class', (q) => {
            q.select(['id', 'name'])
          })
        })
        .first()

      if (data) {
        const userSubjects: any[] = []
        data.user_subject.forEach((subject) => {
          userSubjects.push({
            subject_id: subject.id,
            subject_name: subject.name,
            class_id: subject.class_id,
            class_name: subject.assigned_class.name,
          })
        })

        const newData = {
          id: data.id,
          name: data.name,
          email: data.name,
          institute_id: data.institute_id,
          institute_name: data.user_institute.name,
          created_at: data.created_at,
          user_subject: userSubjects,
        }
        statusCode = 200
        responseData = helper.successResponse('Success!', newData)
      }

      return response.status(statusCode).send(responseData)
    } catch (error) {
      logger.error(error)
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
        name: payload.name,
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
      payload.subject_ids.forEach((ele: number) => {
        assignData.push({
          teacher_id: payload.params.id,
          subject_id: ele,
        })
      })
      await TeacherAssignedSubject.createMany(assignData, { client: trx })
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
          role: Role.teacher,
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
