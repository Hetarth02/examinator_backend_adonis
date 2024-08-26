import User from '#models/user'
import { createTeacherValidator, updateTeacherValidator } from '#validators/teacher'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'

export default class TeachersController {
  async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createTeacherValidator)

    const trx = await db.transaction()
    try {
      const data = {
        ...payload,
        role_id: 3,
      }

      await User.create(data)
      await trx.commit()

      return {
        status: true,
        message: 'Success!',
        result: data,
      }
    } catch (error) {
      await trx.rollback()

      return response.status(500).send({
        status: false,
        message: 'Something went wrong!',
        result: null,
      })
    }
  }

  async list({ response }: HttpContext) {
    try {
      const data = await User.query()
        .select(['id', 'full_name', 'institute_name', 'created_at', 'role_id'])
        .where('role_id', 3)
        .orderBy('id')

      return {
        status: true,
        message: 'Success!',
        result: data,
      }
    } catch (error) {
      return response.status(500).send({
        status: false,
        message: 'Something went wrong!',
        result: null,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      let responseData: { status: boolean; message: string; result: any | null } = {
        status: false,
        message: 'Something went wrong!',
        result: null,
      }
      let statusCode = 404

      const data = await User.query()
        .select(['id', 'full_name', 'institute_name', 'created_at', 'role_id'])
        .where({ id: params.id, role_id: 3 })
        .first()

      if (data) {
        statusCode = 200
        responseData = {
          status: true,
          message: 'Success!',
          result: data,
        }
      }

      return response.status(statusCode).send(responseData)
    } catch (error) {
      return response.status(500).send({
        status: false,
        message: 'Something went wrong!',
        result: null,
      })
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
      const data = {
        email: payload.email,
        password: await hash.make(payload.password),
        full_name: payload.fullName,
        institute_name: payload.instituteName,
      }

      await User.query({ client: trx }).where({ id: payload.params.id, role_id: 3 }).update(data)
      await trx.commit()

      return {
        status: true,
        message: 'Success!',
        result: null,
      }
    } catch (error) {
      await trx.rollback()

      return response.status(500).send({
        status: false,
        message: 'Something went wrong!',
        result: null,
      })
    }
  }

  async delete({ params, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      await User.query({ client: trx })
        .where({
          id: params.id,
          role_id: 3,
        })
        .del()
      await trx.commit()

      return {
        status: true,
        message: 'Success!',
        result: null,
      }
    } catch (error) {
      await trx.rollback()

      return response.status(500).send({
        status: false,
        message: 'Something went wrong!',
        result: null,
      })
    }
  }
}
