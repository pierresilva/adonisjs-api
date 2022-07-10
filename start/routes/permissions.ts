import Route from '@ioc:Adonis/Core/Route'

Route.get('/api/permissions', 'PermissionsController.index')
Route.post('/api/permissions', 'PermissionsController.store')
Route.get('/api/permissions/:id', 'PermissionsController.show')
Route.put('/api/permissions/:id', 'PermissionsController.update')
Route.delete('/api/permissions/:id', 'PermissionsController.destroy')
