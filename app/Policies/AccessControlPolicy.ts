import { action, BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import AccessControl from 'App/Classes/AccessControl'
import User from 'App/Models/User'

export default class AccessControlPolicy extends BasePolicy {
  @action({ allowGuest: true })
  public async is (user: User | null, role: string) {
    const userACL = await AccessControl.getAcl(user?.id)
    let hasRole = false
    userACL.roles.map(thisRole => {
      if (role === thisRole) {
        hasRole = true
      }
    })
    return hasRole
  }

  @action({ allowGuest: true })
  public async can (user: User | null, permission: string) {
    const userACL = await AccessControl.getAcl(user?.id)
    let hasPermission = false
    userACL.permissions.map(thisPermission => {
      if (permission === thisPermission) {
        hasPermission = true
      }
    })
    return hasPermission
  }
}
