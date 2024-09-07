import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TeacherAssignedSubject extends BaseModel {
  @column()
  declare teacher_id: number

  @column()
  declare subject_id: number
}
