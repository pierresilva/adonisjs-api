import Route from '@ioc:Adonis/Core/Route'

Route.post('/api/register', 'AuthController.register')
Route.post('/api/login', 'AuthController.login')
Route.get('/api/logout', 'AuthController.logout')
Route.post('/api/password-reminder', 'AuthController.passwordReminder')
Route.post('/api/password-reset', 'AuthController.passwordReset')
