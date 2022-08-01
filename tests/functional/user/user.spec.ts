import {test} from '@japa/runner'
import User from 'App/Models/User'

test.group('User list', () => {
  // Write your test here
  test('get a paginated list of users result in E_AUTHORIZATION_FAILURE', async ({client}) => {
    const response = await client.get('/api/users')
    response.assertStatus(403)
    response.assertBodyContains({message: 'E_AUTHORIZATION_FAILURE: Not authorized to perform this action'})
  })

  test('get a paginated list of users', async ({client}) => {
    const user = await User.findOrFail(1)
    // @ts-ignore
    const response = await client.get('/api/users').guard('api').loginAs(user)
    response.assertStatus(200)
  })

  test('store user should be fail by invalid payload', async ({client}) => {
    const user = await User.findOrFail(1)
    const payload = {}
    // @ts-ignore
    const response = await client.post('/api/users', payload).guard('api').loginAs(user)
    response.assertStatus(422)
  })

  test('store user should be success', async ({client}) => {
    const user = await User.findOrFail(1)
    const payload = {
      'name': 'Pierre X',
      'email': 'pierremichelsilva@xmail.com',
      'password': 'colombia1',
      'password_confirmation': 'colombia1',
      'roles_ids': [2],
    }
    // @ts-ignore
    const response = await client.post('/api/users').json(payload).guard('api').loginAs(user)
    response.assertStatus(201)
  })

  test('store user should be success without rolesIds', async ({client}) => {
    const user = await User.findOrFail(1)
    const payload = {
      'name': 'Pierre Y',
      'email': 'pierremichelsilva@ymail.com',
      'password': 'colombia1',
      'password_confirmation': 'colombia1',
    }
    // @ts-ignore
    const response = await client.post('/api/users').json(payload).guard('api').loginAs(user)
    response.assertStatus(201)
  })

  test('get a user should be fail', async ({client}) => {
    const user = await User.findOrFail(2)
    // @ts-ignore
    const response = await client.get('/api/users/1').guard('api').loginAs(user)
    response.assertStatus(403)
  })

  test('get a user should be success', async ({client}) => {
    const user = await User.findOrFail(1)
    // @ts-ignore
    const response = await client.get('/api/users/1').guard('api').loginAs(user)
    response.assertStatus(200)
  })

  test('update user should be success without rolesIds', async ({client}) => {
    const auth = await User.findOrFail(1)
    const payloadCreate = {
      'name': 'Pierre Y',
      'email': 'pierremichelsilva@ymail.com',
      'password': 'colombia1',
      'password_confirmation': 'colombia1',
    }
    // @ts-ignore
    await client.post('/api/users').json(payloadCreate).guard('api').loginAs(auth)
    const payloadUpdate = {
      'name': 'Pierre Z',
      'email': 'pierremichelsilva@zmail.com',
      'password': 'colombia1',
      'password_confirmation': 'colombia1',
    }
    // @ts-ignore
    const response = await client.put('/api/users/3').json(payloadUpdate).guard('api').loginAs(auth)
    response.assertStatus(202)
  })

  test('destroy user should be success', async ({client}) => {
    const auth = await User.findOrFail(1)
    const payloadCreate = {
      'name': 'Pierre Y',
      'email': 'pierremichelsilva@ymail.com',
      'password': 'colombia1',
      'password_confirmation': 'colombia1',
    }
    // @ts-ignore
    await client.post('/api/users').json(payloadCreate).guard('api').loginAs(auth)
    // @ts-ignore
    const response = await client.delete('/api/users/3').guard('api').loginAs(auth)
    response.assertStatus(202)
  })
})
