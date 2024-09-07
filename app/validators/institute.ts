import vine from '@vinejs/vine'
import { tableNames } from '../helpers/constants.js'

const createInstituteSchema = vine.object({
  name: vine
    .string()
    .trim()
    .unique(async (db, value) => {
      const data = await db.from(tableNames.institutes).where({ name: value }).first()
      return !data
    }),
})

export const createInstituteValidator = vine.compile(createInstituteSchema)

const updateInstituteSchema = vine.object({
  name: vine
    .string()
    .trim()
    .unique(async (db, value) => {
      const data = await db.from(tableNames.institutes).where({ name: value }).first()
      return !data
    }),
  params: vine.object({
    id: vine.number().withoutDecimals().positive(),
  }),
})

export const updateInstituteValidator = vine.compile(updateInstituteSchema)
