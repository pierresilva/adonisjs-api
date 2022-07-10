import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import Config from '@ioc:Adonis/Core/Config'
import Mail from '@ioc:Adonis/Addons/Mail'
import AccessControl from 'App/Classes/AccessControl'
import Role from 'App/Models/Role'

export default class AuthController {
  /**
   *
   * @param request
   * @param response
   * @param auth
   */
  public async register ({ request, response, auth }: HttpContextContract) {
    const userSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
      ]),
      name: schema.string({ trim: true }, [
        rules.minLength(4),
        rules.maxLength(128),
      ]),
      password: schema.string({ trim: true }, [
        rules.minLength(4),
        rules.maxLength(16),
      ]),
    })

    const data = await request.validate({ schema: userSchema })

    const user = await User.create(data)

    const roleUser = await Role.query().where('slug', 'user').first()

    if (roleUser) {
      await user.related('roles').attach([roleUser?.id])
    }

    try {
      const token = await auth.use('api').attempt(data.email, data.password)
      return response.json({
        message: 'OK',
        data: {
          token: token.toJSON(),
          acl: await AccessControl.getAcl(user.id),
        },
      })
    } catch {
      return response.unauthorized({
        errors: [
          {
            message: 'Invalid credentials',
          },
        ],
      })
    }
  }

  /**
   *
   * @param request
   * @param response
   * @param auth
   */
  public async login ({ request, response, auth }: HttpContextContract) {
    const userSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
      ]),
      password: schema.string(),
    })

    const data = await request.validate({ schema: userSchema })

    try {
      const token = await auth.use('api').attempt(data.email, data.password)
      return response.json({
        message: 'OK',
        data: {
          token: token.toJSON(),
          acl: await AccessControl.getAcl(auth.user?.id),
        },
      })
    } catch {
      return response.unauthorized({
        errors: [
          {
            message: 'Invalid credentials',
          },
        ],
      })
    }
  }

  /**
   *
   * @param response
   * @param auth
   */
  public async logout ({ response, auth }: HttpContextContract) {
    await auth.use('api').revoke()

    return response.json({
      message: 'Logged out successfully',
    })
  }

  /**
   *
   * @param request
   * @param response
   * @param auth
   */
  public async passwordReminder ({ request, response }: HttpContextContract) {
    const formSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
      ]),
    })

    const data = await request.validate({ schema: formSchema })

    const user = await User.findBy('email', data.email)

    if (!user) {
      return response.notFound({
        errors: [
          {
            message: 'No user email found',
          },
        ],
      })
    }

    const token = await Hash.make(new Date().toLocaleDateString())

    user.rememberMeToken = token
    await user.save()

    const url = Config.get('app.frontUrl') + '/password-reset/' + token

    await Mail.sendLater((message) => {
      message
        .from(Config.get('mail.mailers.smtp.user'))
        .to(user.email)
        .subject('Password reminder!')
        .htmlView('emails/password_reminder', { url })
    })

    return response.json({
      message: 'Password reminder send successfully',
      data: user,
    })
  }

  /**
   *
   * @param request
   * @param response
   * @param auth
   */
  public async passwordReset ({ request, response, auth }: HttpContextContract) {
    const formSchema = schema.create({
      password: schema.string({ trim: true }, [
        rules.minLength(6),
        rules.maxLength(128),
        rules.confirmed(),
      ]),
      token: schema.string(),
    })
    const data = await request.validate({ schema: formSchema })

    const user = await User.query()
      .where('remember_me_token', data.token)
      .firstOrFail()

    user.password = data.password
    user.rememberMeToken = ''
    await user.save()

    try {
      const token = await auth.use('api').attempt(user.email, user.password)
      return response.ok({
        message: 'OK',
        data: {
          token: token.toJSON(),
          acl: await AccessControl.getAcl(user.id),
        },
      })
    } catch {
      return response.unauthorized({
        errors: [
          {
            message: 'Invalid credentials',
          },
        ],
      })
    }
  }
}
