import vine from '@vinejs/vine'
import { ContentType } from '../helpers/enums.js'

const createChapterSchema = vine.object({
  subject_id: vine.number().withoutDecimals().positive(),
  name: vine.string().trim(),
  content_type: vine.enum(ContentType),
  content: vine.string().trim(),
})

export const createChapterValidator = vine.compile(createChapterSchema)

const updateChapterSchema = vine.object({
  subject_id: vine.number().withoutDecimals().positive(),
  name: vine.string().trim(),
  content_type: vine.enum(ContentType),
  content: vine.string().trim(),
  params: vine.object({
    id: vine.number().withoutDecimals().positive(),
  }),
})

export const updateChapterValidator = vine.compile(updateChapterSchema)
