import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { string } from '@ioc:Adonis/Core/Helpers'

/**
 * @swagger
 * components:
 *  schemas:
 *    Permission:
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
export default class Permission extends BaseModel {
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
  public static async makeSlug (permission: Permission) {
    if (permission.$dirty.name) {
      permission.slug = string.dotCase(permission.name)
    }
  }
}
