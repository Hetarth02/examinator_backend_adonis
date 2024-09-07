import { BaseSchema } from '@adonisjs/lucid/schema'
import { Role } from '../../app/helpers/enums.js'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.text('full_name').notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('password').notNullable()
      table.enum('role', Object.values(Role), {
        useNative: true,
        enumName: 'user_roles_enum',
        existingType: false,
        schemaName: 'public',
      })

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS "user_roles_enum"')
  }
}
