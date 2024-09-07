import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserSeeder from '../user_seeder.js'

export default class IndexSeeder extends BaseSeeder {
  async run() {
    await new UserSeeder(this.client).run()
  }
}
