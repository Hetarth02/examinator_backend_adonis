import { DateTime } from 'luxon'
import { BaseModel, column, hasManyThrough, hasOne } from '@adonisjs/lucid/orm'
import type { HasManyThrough, HasOne } from '@adonisjs/lucid/types/relations'
import Class from '#models/class'
import User from '#models/user'
import TeacherAssignedSubject from '#models/teacher_assigned_subject'

export default class Subject extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare class_id: number

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @hasOne(() => Class, {
    localKey: 'class_id',
    foreignKey: 'id',
  })
  declare assigned_class: HasOne<typeof Class>

  @hasManyThrough([() => User, () => TeacherAssignedSubject], {
    throughLocalKey: 'teacher_id',
    throughForeignKey: 'id',
    localKey: 'id',
    foreignKey: 'subject_id',
  })
  declare assigned_teacher: HasManyThrough<typeof User>
}
