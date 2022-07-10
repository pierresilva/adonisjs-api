import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AccessControl from 'App/Classes/AccessControl'

export default class Is {
  public async handle ({ response, auth }: HttpContextContract, next: () => Promise<void>, roles: string[]) {
    const userACl = await AccessControl.getAcl(auth.user?.id)
    let userIs = false
    roles.map(role => {
      userACl.roles.map(userRole => {
        if (userRole === role) {
          userIs = true
        }
      })
    })

    if (!userIs) {
      response.unauthorized({
        error: 'You do not have the required role',
      })
      return
    }

    await next()
  }
}
