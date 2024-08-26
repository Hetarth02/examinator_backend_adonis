import vine from '@vinejs/vine'

const createTeacherSchema = vine.object({
  email: vine
    .string()
    .trim()
    .email()
    .normalizeEmail({
      all_lowercase: true,
    })
    .unique(async (db, value) => {
      const user = await db.from('users').where({ email: value }).first()
      return !user
    }),
  password: vine.string().trim().minLength(8),
  fullName: vine.string().trim(),
  instituteName: vine.string().trim().optional(),
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
        .from('users')
        .whereNot('id', field.meta.userId)
        .where({ email: value })
        .first()
      return !user
    }),
  password: vine.string().trim().minLength(8),
  fullName: vine.string().trim(),
  instituteName: vine.string().trim().optional(),
  params: vine.object({
    id: vine.number().withoutDecimals(),
  }),
})

export const updateTeacherValidator = vine.compile(updateTeacherSchema)
