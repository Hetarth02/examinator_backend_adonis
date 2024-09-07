import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import { ContentType } from '../helpers/enums.js'
import User from '#models/user'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class Chapter extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare subject_id: number

  @column()
  declare user_id: number

  @column()
  declare name: string

  @column()
  declare content_type: ContentType

  @column()
  declare content: string

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @hasOne(() => User, {
    localKey: 'user_id',
    foreignKey: 'id',
  })
  declare created_by: HasOne<typeof User>
}
