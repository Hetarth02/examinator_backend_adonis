import Role from '#models/role'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class UserSeeder extends BaseSeeder {
  async run() {
    const roleId = await Role.query().select('id').where('name', 'admin').first()
    if (roleId) {
      await User.create({
        email: 'admin@mailinator.com',
        password: '123456789',
        fullName: 'Admin',
        role_id: roleId.id,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      })
    }
  }
}
