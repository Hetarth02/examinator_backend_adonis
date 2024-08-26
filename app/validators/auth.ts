import vine from '@vinejs/vine'

const loginSchema = vine.object({
  email: vine.string().trim().email().normalizeEmail({
    all_lowercase: true,
  }),
  password: vine.string().trim().minLength(8),
})

export const loginValidator = vine.compile(loginSchema)
