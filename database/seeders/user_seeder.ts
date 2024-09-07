import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { Role } from '../../app/helpers/enums.js'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.create({
      email: 'admin@mailinator.com',
      institute_id: 0,
      password: '123456789',
      name: 'Admin',
      role: Role.admin,
    })
  }
}
