import vine from '@vinejs/vine'
import { tableNames } from '../helpers/constants.js'

const createOwnerSchema = vine.object({
  email: vine
    .string()
    .trim()
    .email()
    .normalizeEmail({
      all_lowercase: true,
    })
    .unique(async (db, value) => {
      const data = await db.from(tableNames.users).where({ email: value }).first()
      return !data
    }),
  password: vine.string().trim().minLength(8),
  name: vine.string().trim(),
  institute_name: vine.string().trim(),
})

export const createOwnerValidator = vine.compile(createOwnerSchema)

const updateOwnerSchema = vine.object({
  email: vine
    .string()
    .trim()
    .email()
    .normalizeEmail({
      all_lowercase: true,
    })
    .unique(async (db, value, field) => {
      const data = await db
        .from(tableNames.users)
        .whereNot('id', field.meta.userId)
        .where({ email: value })
        .first()
      return !data
    }),
  password: vine.string().trim().minLength(8).optional(),
  name: vine.string().trim(),
  institute_name: vine.string().trim(),
  params: vine.object({
    id: vine.number().withoutDecimals().positive(),
  }),
})

export const updateOwnerValidator = vine.compile(updateOwnerSchema)
