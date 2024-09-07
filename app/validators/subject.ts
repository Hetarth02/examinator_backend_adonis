import vine from '@vinejs/vine'

const createSubjectSchema = vine.object({
  subjectName: vine.string().trim(),
  classId: vine.number().withoutDecimals(),
})

export const createSubjectValidator = vine.compile(createSubjectSchema)

const updateSubjectSchema = vine.object({
  subjectName: vine.string().trim(),
  params: vine.object({
    id: vine.number().withoutDecimals(),
  }),
})

export const updateSubjectValidator = vine.compile(updateSubjectSchema)
