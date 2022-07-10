import User from 'App/Models/User'

export default class AccessControl {
  public static async getAcl (userId: number | undefined) {
    if (!userId) {
      return {roles: ['guest'], permissions: ['access.guest']}
    }

    const user = await User.query()
      .preload('roles', query => query.preload('permissions'))
      .where('id', userId)
      .first()

    const roles: string[] = []
    const permissions: string[] = []

    user?.roles.map(role => {
      roles.push(role.slug)
      role.permissions.map(permission => {
        permissions.push(permission.slug)
      })
    })

    return {roles: [...roles], permissions: [...new Set(permissions)]}
  }
}
