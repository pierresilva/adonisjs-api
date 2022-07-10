import Route from '@ioc:Adonis/Core/Route'

Route.get('/api/users', 'UsersController.index')
Route.post('/api/users', 'UsersController.store')
Route.get('/api/users/:id', 'UsersController.show')
Route.put('/api/users/:id', 'UsersController.update')
Route.delete('/api/users/:id', 'UsersController.destroy')
