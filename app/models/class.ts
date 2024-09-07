import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Subject from './subject.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Class extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Subject, {
    localKey: 'id',
    foreignKey: 'class_id',
    serializeAs: 'classSubject',
  })
  declare class_subject: HasMany<typeof Subject>
}
