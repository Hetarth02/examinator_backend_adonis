import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasManyThrough, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasManyThrough, HasOne } from '@adonisjs/lucid/types/relations'
import Subject from '#models/subject'
import Institute from '#models/institute'
import { Role } from '../helpers/enums.js'
import TeacherAssignedSubject from '#models/teacher_assigned_subject'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: Role

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @column()
  declare institute_id: number

  @hasOne(() => Institute, {
    localKey: 'institute_id',
    foreignKey: 'id',
  })
  declare user_institute: HasOne<typeof Institute>

  @hasManyThrough([() => Subject, () => TeacherAssignedSubject], {
    throughLocalKey: 'subject_id',
    throughForeignKey: 'id',
    localKey: 'id',
    foreignKey: 'teacher_id',
  })
  declare user_subject: HasManyThrough<typeof Subject>

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30d',
  })
}
