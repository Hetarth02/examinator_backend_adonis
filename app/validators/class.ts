import vine from '@vinejs/vine'
import { tableNames } from '../helpers/constants.js'

const createClassSchema = vine.object({
  name: vine
    .string()
    .trim()
    .unique(async (db, value, field) => {
      const data = await db
        .from(tableNames.classes)
        .where({ name: value, institute_id: field.meta.institute_id })
        .first()
      return !data
    }),
})

export const createClassValidator = vine.compile(createClassSchema)

const updateClassSchema = vine.object({
  name: vine
    .string()
    .trim()
    .unique(async (db, value, field) => {
      const data = await db
        .from(tableNames.classes)
        .where({ name: value, institute_id: field.meta.institute_id })
        .first()
      return !data
    }),
  params: vine.object({
    id: vine.number().withoutDecimals().positive(),
  }),
})

export const updateClassValidator = vine.compile(updateClassSchema)
