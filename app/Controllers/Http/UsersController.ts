import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import AccessControl from 'App/Classes/AccessControl'
import UserValidator from 'App/Validators/UserValidator'
import Role from 'App/Models/Role'

export default class UsersController {
  /**
   * @swagger
   * /api/users:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Users
   *     description: List of users. Needed permission "users.index"
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
  public async index ({bouncer, request, response}: HttpContextContract) {
    await bouncer.with('AccessControlPolicy').authorize('can', 'users.index')
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const users = await User.query()
      .preload('roles', (query) => {
        query.preload('permissions')
      })
      .paginate(page, limit)

    return response.ok({
      message: 'OK',
      data: users.toJSON().data,
      meta: users.toJSON().meta,
    })
  }

  /**
   * @swagger
   * /api/users:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Users
   *     description: Store new user. Needed permission "users.store"
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
   *                 example: 'James Bond'
   *                 required: true
   *               email:
   *                 type: string
   *                 example: 'Bond007@example.com'
   *                 required: true
   *               password:
   *                 type: string
   *                 example: '0007password'
   *                 required: true
   *               password_confirmation:
   *                 type: string
   *                 example: '0007password'
   *                 required: true
   *               role_ids:
   *                 type: array
   *                 example: [1]
   *                 required: false
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   */
  public async store ({bouncer, request, response}: HttpContextContract) {
    await bouncer.with('AccessControlPolicy').authorize('can', 'users.store')

    const data = await request.validate(UserValidator)

    const user = await User.create(data)

    if (request.input('role_ids')) {
      await user.related('roles').sync(request.input('role_ids'))
    }

    if (!request.input('role_ids')) {
      const roleUser = await Role.query().where('slug', 'user').firstOrFail()
      await user.related('roles').sync([roleUser.id])
    }

    return response.created({
      message: 'OK',
      data: user,
    })
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Users
   *     description: Show a existent user. Needed permission "users.show"
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       403:
   *         description: Forbidden
   */
  public async show ({bouncer, response, params}: HttpContextContract) {
    await bouncer.with('AccessControlPolicy').authorize('can', 'users.show')

    const user = await User.query()
      .preload('roles', (query) => query.preload('permissions'))
      .where('id', params.id)
      .first()

    const acl = await AccessControl.getAcl(user?.id)

    return response.ok({
      message: 'OK',
      data: {
        ...user ? user.toJSON() : null,
        role_ids: user ? user.roles.map(role => role.id) : [],
        acl,
      },
    })
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     description: Update existent user. Needed permission "users.update"
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
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
   *                 example: 'James Bond'
   *                 required: true
   *               email:
   *                 type: string
   *                 example: 'Bond007@example.com'
   *                 required: true
   *               password:
   *                 type: string
   *                 example: '0007password'
   *                 required: true
   *               password_confirmation:
   *                 type: string
   *                 example: '0007password'
   *                 required: true
   *               role_ids:
   *                 type: array
   *                 example: [1, 2]
   *                 required: false
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
  public async update ({bouncer, request, response, params}: HttpContextContract) {
    await bouncer.with('AccessControlPolicy').authorize('can', 'users.update')
    const data = await request.validate(UserValidator)

    const user = await User.findOrFail(params.id)

    await user.merge(data)

    if (request.input('role_ids')) {
      await user.related('roles').sync(request.input('role_ids'))
    }

    if (!request.input('role_ids')) {
      const roleUser = await Role.query().where('slug', 'user').firstOrFail()
      await user.related('roles').sync([roleUser.id])
    }

    return response.accepted({
      message: 'OK',
      data: user,
    })
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     description: Destroy existent user. Needed permission "users.destroy"
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
  public async destroy ({bouncer, response, params}: HttpContextContract) {
    await bouncer.with('AccessControlPolicy').authorize('can', 'users.destroy')
    const user = await User.query().preload('roles').where('id', params.id).firstOrFail()
    await user.related('roles').detach(user.roles.map(role => role.id))
    await user.delete()

    return response.accepted({
      message: 'OK',
      data: user,
    })
  }
}
