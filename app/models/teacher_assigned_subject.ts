import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TeacherAssignedSubject extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare teacher_id: number

  @column()
  declare subject_id: number
}
