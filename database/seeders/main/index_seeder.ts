import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserSeeder from '../user_seeder.js'
import InstituteSeeder from '../institute_seeder.js'

export default class IndexSeeder extends BaseSeeder {
  async run() {
    await new InstituteSeeder(this.client).run()
    await new UserSeeder(this.client).run()
  }
}
