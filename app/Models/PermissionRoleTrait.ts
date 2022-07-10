import { BaseModel, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Permission from './Permission'
import Role from './Role'

export default class PermissionRoleTrait extends BaseModel {
  @manyToMany(() => Permission)
  public permissions: ManyToMany<typeof Permission>

  @manyToMany(() => Role)
  public roles: ManyToMany<typeof Role>

  public getRoles () {
    const roles: string[] = []
    this.roles.map(role => {
      roles.push(role.slug)
    })

    return roles
  }
}
