import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Permission from 'App/Models/Permission'
import PermissionValidator from 'App/Validators/PermissionValidator'

export default class PermissionsController {
  /**
   * @swagger
   * /api/permissions:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Permissions
   *     description: List of permissions. Needed permission "permissions.index"
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
  public async index ({ bouncer, request, response }: HttpContextContract) {
    await bouncer.with('AccessControlPolicy').authorize('can', 'permissions.index')
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const permissions = await (await Permission.query().paginate(page, limit)).toJSON()

    return response.ok({
      message: 'OK',
      data: permissions.data,
      meta: permissions.meta,
    })
  }

  /**
   * @swagger
   * /api/permissions:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Permissions
   *     description: Store new permission. Needed permission "permissions.store"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           description: Permission payload
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: 'New Permission'
   *                 required: true
   *               description:
   *                 type: string
   *                 example: 'New permission for testing'
   *                 required: true
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Permission'
   */
  public async store ({ bouncer, request, response }: HttpContextContract) {
    await bouncer.with('AccessControlPolicy').authorize('can', 'permissions.store')
    const data = await request.validate(PermissionValidator)

    const permission = await Permission.create(data)

    return response.ok({
      message: 'OK',
      data: permission,
    })
  }

  /**
   * @swagger
   * /api/permissions/{id}:
   *   get:
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Permissions
   *     description: Show an existent permission. Needed permission "permissions.show"
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Permission'
   *       403:
   *         description: Forbidden
   */
  public async show ({ bouncer, params, response }: HttpContextContract) {
    await bouncer.with('AccessControlPolicy').authorize('can', 'permissions.show')
    const permission = await Permission.findOrFail(params.id)

    return response.ok({
      message: 'OK',
      data: permission,
    })
  }

  /**
   * @swagger
   * /api/permissions/{id}:
   *   put:
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Permissions
   *     description: Update an existent permission. Needed permission "permissions.update"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           description: Permission payload
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: 'New Permission'
   *                 required: true
   *               description:
   *                 type: string
   *                 example: 'New permission for testing'
   *                 required: true
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Permission'
   */
  public async update ({ bouncer, params, request, response }: HttpContextContract) {
    await bouncer.with('AccessControlPolicy').authorize('can', 'permissions.update')
    const data = await request.validate(PermissionValidator)

    const permission = await Permission.findOrFail(params.id)

    permission.merge(data)
    permission.save()

    return response.accepted({
      message: 'OK',
      data: permission,
    })
  }

  /**
   * @swagger
   * /api/permissions/{id}:
   *   delete:
   *     tags:
   *       - Permissions
   *     security:
   *       - bearerAuth: []
   *     description: Destroy existent permission. Needed permission "permissions.destroy"
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
   *               $ref: '#/components/schemas/Permission'
   */
  public async destroy ({ bouncer, params, response }: HttpContextContract) {
    await bouncer.with('AccessControlPolicy').authorize('can', 'permissions.destroy')
    const permission = await Permission.findOrFail(params.id)
    permission.delete()

    return response.accepted({
      message: 'OK',
      data: permission,
    })
  }
}
