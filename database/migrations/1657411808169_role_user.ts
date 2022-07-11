import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'role_user'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('role_id').unsigned().references('roles.id')
      table.integer('user_id').unsigned().references('users.id')
      table.unique(['role_id', 'user_id'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
