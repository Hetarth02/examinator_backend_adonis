import { BaseSchema } from '@adonisjs/lucid/schema'
import { ContentType } from '../../app/helpers/enums.js'

export default class extends BaseSchema {
  protected tableName = 'chapters'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('subject_id')
        .notNullable()
        .references('id')
        .inTable('subjects')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.text('name').notNullable()
      table.enum('content_type', Object.values(ContentType), {
        useNative: true,
        enumName: 'chapter_content_types_enum',
        existingType: false,
        schemaName: 'public',
      })
      table.text('content').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS "chapter_content_types_enum"')
  }
}
