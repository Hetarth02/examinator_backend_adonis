import vine from '@vinejs/vine'
import { tableNames } from '../helpers/constants.js'

const createTeacherSchema = vine.object({
  email: vine
    .string()
    .trim()
    .email()
    .normalizeEmail({
      all_lowercase: true,
    })
    .unique(async (db, value) => {
      const user = await db.from(tableNames.users).where({ email: value }).first()
      return !user
    }),
  password: vine.string().trim().minLength(8),
  fullName: vine.string().trim(),
  instituteId: vine.number().withoutDecimals(),
  subjectsId: vine.array(vine.number().withoutDecimals()),
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
        .where({ email: value })
        .first()
      return !user
    }),
  password: vine.string().trim().minLength(8).optional(),
  fullName: vine.string().trim(),
  instituteId: vine.number().withoutDecimals(),
  subjectsId: vine.array(vine.number().withoutDecimals()),
  params: vine.object({
    id: vine.number().withoutDecimals(),
  }),
})

export const updateTeacherValidator = vine.compile(updateTeacherSchema)
