import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import Subject from './subject.js'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class TeacherAssignedSubject extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare teacher_id: number

  @column()
  declare subject_id: number

  @hasOne(() => Subject, {
    localKey: 'subject_id',
    foreignKey: 'id',
  })
  declare assigned_subject: HasOne<typeof Subject>
}
