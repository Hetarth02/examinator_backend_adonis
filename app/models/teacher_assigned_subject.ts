import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TeacherAssignedSubject extends BaseModel {
  @column()
  declare teacherId: number

  @column()
  declare subjectId: number
}
