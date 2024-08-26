import vine from '@vinejs/vine'

const createOwnerSchema = vine.object({
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
  instituteName: vine.string().trim(),
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
      const user = await db
        .from('users')
        .whereNot('id', field.meta.userId)
        .where({ email: value })
        .first()
      return !user
    }),
  password: vine.string().trim().minLength(8),
  fullName: vine.string().trim(),
  instituteName: vine.string().trim(),
  params: vine.object({
    id: vine.number().withoutDecimals(),
  }),
})

export const updateOwnerValidator = vine.compile(updateOwnerSchema)
