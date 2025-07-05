import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'monitor_entries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').unique().notNullable()

      table.string('type').index().notNullable()
      table.jsonb('payload').notNullable()

      table.timestamp('created_at').index().notNullable()
      table.timestamp('updated_at').index().notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}