import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserSeeder from '../user_seeder.js'
import RoleSeeder from '../role_seeder.js'

export default class IndexSeeder extends BaseSeeder {
  async run() {
    await new RoleSeeder(this.client).run()
    await new UserSeeder(this.client).run()
  }
}
