import Role from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class RoleSeeder extends BaseSeeder {
  async run() {
    await Role.createMany([
      {
        name: 'admin',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      },
      {
        name: 'owner',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      },
      {
        name: 'teacher',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      },
    ])
  }
}
