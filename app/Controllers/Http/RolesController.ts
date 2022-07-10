import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RoleValidator from 'App/Validators/RoleValidator'
import Role from 'App/Models/Role'

export default class RolesController {
  public async index ({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const roles = (await Role.query().paginate(page, limit)).toJSON()

    return response.ok({
      message: 'OK',
      data: roles.data,
      meta: roles.meta,
    })
  }

  public async store ({ request, response }: HttpContextContract) {
    const data = await request.validate(RoleValidator)

    const role = await Role.create(data)

    if (request.input('permission_ids')) {
      await role.related('permissions').sync(request.input('permission_ids'))
    }

    return response.ok({
      message: 'OK',
      data: role,
    })
  }

  public async show ({ params, response }: HttpContextContract) {
    const role = await Role.query()
      .preload('permissions')
      .where('id', params.id)
      .firstOrFail()

    return response.ok({
      message: 'OK',
      data: {
        ...role.toJSON(),
        permission_ids: role.permissions.map(permission => permission.id),
      },
    })
  }

  public async update ({ params, request, response }: HttpContextContract) {
    const data = await request.validate(RoleValidator)

    const role = await Role.query().preload('permissions').where('id', params.id).firstOrFail()

    await role.merge(data)
    await role.save()

    if (request.input('permission_ids')) {
      await role.related('permissions').sync(request.input('permission_ids'))
    }

    return response.accepted({
      message: 'OK',
      data: role,
    })
  }

  public async destroy ({ params, response }: HttpContextContract) {
    const role = await Role.query().preload('permissions').where('id', params.id).firstOrFail()
    await role?.related('permissions').detach(role.permissions.map(permission => permission.id))
    await role?.delete()

    return response.accepted({
      message: 'OK',
      data: role,
    })
  }
}
