import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Subject from './subject.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Class extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare institute_id: number

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @hasMany(() => Subject, {
    localKey: 'id',
    foreignKey: 'class_id',
  })
  declare class_subject: HasMany<typeof Subject>
}
