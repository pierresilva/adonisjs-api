import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RoleValidator from 'App/Validators/RoleValidator'
import Role from 'App/Models/Role'

/**
 * @swagger
 * /api/roles:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Roles
 *     description: List of roles. Needed permission "roles.index"
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *       - name: limit
 *         in: query
 *         required: false
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *       403:
 *         description: Forbidden
 */
export default class RolesController {
  public async index ({ bouncer, request, response }: HttpContextContract) {
    await bouncer.with('AccessControlPolicy').authorize('can', 'roles.index')
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const roles = (await Role.query().paginate(page, limit)).toJSON()

    return response.ok({
      message: 'OK',
      data: roles.data,
      meta: roles.meta,
    })
  }

  /**
   * @swagger
   * /api/roles:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Roles
   *     description: Store new role. Needed permission "roles.store"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           description: User payload
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: 'New Role'
   *                 required: true
   *               description:
   *                 type: string
   *                 example: 'New role for testing'
   *                 required: true
   *               permissions_ids:
   *                 type: array
   *                 example: [1, 2]
   *                 required: false
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Role'
   */
  public async store ({ bouncer, request, response }: HttpContextContract) {
    await bouncer.with('AccessControlPolicy').authorize('can', 'roles.store')
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

  /**
   * @swagger
   * /api/roles/{id}:
   *   get:
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Roles
   *     description: Show an existent role. Needed permission "roles.show"
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Role'
   *       403:
   *         description: Forbidden
   */
  public async show ({ bouncer, params, response }: HttpContextContract) {
    await bouncer.with('AccessControlPolicy').authorize('can', 'roles.show')
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

  /**
   * @swagger
   * /api/roles/{id}:
   *   put:
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Roles
   *     description: Update an existent role. Needed permission "roles.update"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           description: User payload
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: 'New Role'
   *                 required: true
   *               description:
   *                 type: string
   *                 example: 'New role for testing'
   *                 required: true
   *               permissions_ids:
   *                 type: array
   *                 example: [1, 2]
   *                 required: false
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Role'
   */
  public async update ({ bouncer, params, request, response }: HttpContextContract) {
    await bouncer.with('AccessControlPolicy').authorize('can', 'roles.update')
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

  /**
   * @swagger
   * /api/roles/{id}:
   *   delete:
   *     tags:
   *       - Roles
   *     security:
   *       - bearerAuth: []
   *     description: Destroy existent role. Needed permission "roles.destroy"
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *     produces:
   *       - application/json
   *     responses:
   *       202:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   */
  public async destroy ({ bouncer, params, response }: HttpContextContract) {
    await bouncer.with('AccessControlPolicy').authorize('can', 'roles.destroy')
    const role = await Role.query().preload('permissions').where('id', params.id).firstOrFail()
    await role?.related('permissions').detach(role.permissions.map(permission => permission.id))
    await role?.delete()

    return response.accepted({
      message: 'OK',
      data: role,
    })
  }
}
