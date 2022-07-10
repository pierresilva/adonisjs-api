import Route from '@ioc:Adonis/Core/Route'

Route.get('/api/roles', 'RolesController.index')
Route.post('/api/roles', 'RolesController.store')
Route.get('/api/roles/:id', 'RolesController.show')
Route.put('/api/roles/:id', 'RolesController.update')
Route.delete('/api/roles/:id', 'RolesController.destroy')
