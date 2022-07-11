import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AccessControl from 'App/Classes/AccessControl'

export default class Can {
  public async handle ({ response, auth }: HttpContextContract, next: () => Promise<void>, permissions: string[]) {
    const userACl = await AccessControl.getAcl(auth.user?.id)
    let userCan = false
    permissions.map(permission => {
      userACl.permissions.map(userPermission => {
        if (userPermission === permission) {
          userCan = true
        }
      })
    })

    if (!userCan) {
      response.unauthorized({
        errors: [
          {
            message: 'You do not have the required permission',
          },
        ],
      })
      return
    }

    await next()
  }
}
