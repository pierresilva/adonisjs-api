import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { string } from '@ioc:Adonis/Core/Helpers'
import Permission from './Permission'

/**
 * @swagger
 * components:
 *   schemas:
 *    Role:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        name:
 *          type: string
 *        slug:
 *          type: string
 *        description:
 *          type: string
 *        created_at:
 *          type: string
 *        updated_at:
 *          type: string
 *
 */
export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public description: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async makeSlug (role: Role) {
    if (role.$dirty.name) {
      role.slug = string.dotCase(role.name)
    }
  }

  @manyToMany(() => Permission)
  public permissions: ManyToMany<typeof Permission>
}
