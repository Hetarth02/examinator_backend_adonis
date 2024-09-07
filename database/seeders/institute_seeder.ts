import Institute from '#models/institute'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class InstituteSeeder extends BaseSeeder {
  async run() {
    await Institute.create({
      id: 0,
      name: 'Admin Institute',
    })
  }
}
