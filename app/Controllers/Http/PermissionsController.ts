import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Permission from 'App/Models/Permission'
import PermissionValidator from 'App/Validators/PermissionValidator'

export default class PermissionsController {
  public async index ({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const permissions = await (await Permission.query().paginate(page, limit)).toJSON()

    return response.ok({
      message: 'OK',
      data: permissions.data,
      meta: permissions.meta,
    })
  }

  public async store ({ request, response }: HttpContextContract) {
    const data = await request.validate(PermissionValidator)

    const permission = await Permission.create(data)

    return response.ok({
      message: 'OK',
      data: permission,
    })
  }

  public async show ({ params, response }: HttpContextContract) {
    const permission = await Permission.findOrFail(params.id)

    return response.ok({
      message: 'OK',
      data: permission,
    })
  }

  public async update ({ params, request, response }: HttpContextContract) {
    const data = await request.validate(PermissionValidator)

    const permission = await Permission.findOrFail(params.id)

    permission.merge(data)
    permission.save()

    return response.accepted({
      message: 'OK',
      data: permission,
    })
  }

  public async destroy ({ params, response }: HttpContextContract) {
    const permission = await Permission.findOrFail(params.id)
    permission.delete()

    return response.accepted({
      message: 'OK',
      data: permission,
    })
  }
}
