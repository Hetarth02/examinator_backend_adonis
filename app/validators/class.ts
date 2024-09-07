import vine from '@vinejs/vine'
import { tableNames } from '../helpers/constants.js'

const createClassSchema = vine.object({
  className: vine
    .string()
    .trim()
    .unique(async (db, value) => {
      const data = await db.from(tableNames.classes).where({ name: value }).first()
      return !data
    }),
})

export const createClassValidator = vine.compile(createClassSchema)

const updateClassSchema = vine.object({
  className: vine
    .string()
    .trim()
    .unique(async (db, value) => {
      const data = await db.from(tableNames.classes).where({ name: value }).first()
      return !data
    }),
  params: vine.object({
    id: vine.number().withoutDecimals(),
  }),
})

export const updateClassValidator = vine.compile(updateClassSchema)
