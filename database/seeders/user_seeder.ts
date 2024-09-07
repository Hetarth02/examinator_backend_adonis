import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import { Role } from '../../app/helpers/enums.js'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.create({
      email: 'admin@mailinator.com',
      password: '123456789',
      fullName: 'Admin',
      role: Role.admin,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    })
  }
}
