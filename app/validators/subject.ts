import vine from '@vinejs/vine'

const createSubjectSchema = vine.object({
  name: vine.string().trim(),
  class_id: vine.number().withoutDecimals().positive(),
})

export const createSubjectValidator = vine.compile(createSubjectSchema)

const updateSubjectSchema = vine.object({
  name: vine.string().trim(),
  params: vine.object({
    id: vine.number().withoutDecimals().positive(),
  }),
})

export const updateSubjectValidator = vine.compile(updateSubjectSchema)
