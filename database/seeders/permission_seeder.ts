import Permission from '#models/permission'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class PermissionSeeder extends BaseSeeder {
  async run() {
    const permissions = ['create', 'list', 'update', 'delete']
    const entities = ['owner', 'teacher', 'classes', 'subject', 'exams']
    const dataArr: Partial<Permission>[] = []

    entities.forEach((ele) => {
      permissions.forEach((permission) => {
        dataArr.push({
          name: `${permission}-${ele}`,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        })
      })
    })

    await Permission.createMany(dataArr)
  }
}
