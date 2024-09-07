import vine from '@vinejs/vine'
import { tableNames } from '../helpers/constants.js'
import { Role } from '../helpers/enums.js'

const createTeacherSchema = vine.object({
  email: vine
    .string()
    .trim()
    .email()
    .normalizeEmail({
      all_lowercase: true,
    })
    .unique(async (db, value) => {
      const user = await db
        .from(tableNames.users)
        .where({ email: value, role: Role.teacher })
        .first()
      return !user
    }),
  password: vine.string().trim().minLength(8),
  name: vine.string().trim(),
  subject_ids: vine.array(vine.number().withoutDecimals().positive()),
})

export const createTeacherValidator = vine.compile(createTeacherSchema)

const updateTeacherSchema = vine.object({
  email: vine
    .string()
    .trim()
    .email()
    .normalizeEmail({
      all_lowercase: true,
    })
    .unique(async (db, value, field) => {
      const user = await db
        .from(tableNames.users)
        .whereNot('id', field.meta.userId)
        .where({ email: value, role: Role.teacher })
        .first()
      return !user
    }),
  password: vine.string().trim().minLength(8).optional(),
  name: vine.string().trim(),
  subject_ids: vine.array(vine.number().withoutDecimals().positive()),
  params: vine.object({
    id: vine.number().withoutDecimals().positive(),
  }),
})

export const updateTeacherValidator = vine.compile(updateTeacherSchema)
