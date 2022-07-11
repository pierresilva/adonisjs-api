import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'permission_role'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('permission_id').unsigned().references('permissions.id')
      table.integer('role_id').unsigned().references('roles.id')
      table.unique(['permission_id', 'role_id'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
