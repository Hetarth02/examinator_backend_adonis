import Permission from '#models/permission'
import RolePermission from '#models/role_permission'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class RolePermissionSeeder extends BaseSeeder {
  async run() {
    const permissions = await Permission.query().select('id')
    const dataArr: Partial<RolePermission>[] = []

    permissions.forEach((ele) => {
      dataArr.push({
        role_id: 1,
        permission_id: ele.id,
      })
    })

    await db.table('role_permissions').returning('').multiInsert(dataArr)
    // await RolePermission.createMany(dataArr)
  }
}
