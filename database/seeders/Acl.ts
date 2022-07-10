import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run () {
    await User.createMany([
      {
        name: 'Administrator',
        email: 'admin@email.com',
        password: '123456',
      },
      {
        name: 'User',
        email: 'user@email.com',
        password: '123456',
      },
    ])

    const roleAdmin = await Role.create({name: 'Administrator'})
    const roleUser = await Role.create({name: 'User'})

    await roleAdmin.related('permissions').create({name: 'Access Admin'})
    await roleAdmin.related('permissions').create({name: 'Users Index'})
    await roleAdmin.related('permissions').create({name: 'Users Store'})
    await roleAdmin.related('permissions').create({name: 'Users Update'})
    await roleAdmin.related('permissions').create({name: 'Users Show'})
    await roleAdmin.related('permissions').create({name: 'Users Destroy'})
    await roleAdmin.related('permissions').create({name: 'Roles Index'})
    await roleAdmin.related('permissions').create({name: 'Roles Store'})
    await roleAdmin.related('permissions').create({name: 'Roles Update'})
    await roleAdmin.related('permissions').create({name: 'Roles Show'})
    await roleAdmin.related('permissions').create({name: 'Roles Destroy'})
    await roleAdmin.related('permissions').create({name: 'Permissions Index'})
    await roleAdmin.related('permissions').create({name: 'Permissions Store'})
    await roleAdmin.related('permissions').create({name: 'Permissions Update'})
    await roleAdmin.related('permissions').create({name: 'Permissions Show'})
    await roleAdmin.related('permissions').create({name: 'Permissions Destroy'})

    await roleUser.related('permissions').create({name: 'Access User'})

    const admin = await User.query().where('email', 'admin@email.com').first()
    await admin?.related('roles').attach([roleAdmin.id, roleUser.id])
    const user = await User.query().where('email', 'user@email.com').first()
    await user?.related('roles').attach([roleUser.id])
  }
}
