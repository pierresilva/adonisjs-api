# adonisjs-api
### Adonis JS 5 Starter API

1. `npm install`
2. `cp .env.example .env`
3. Update `.env`
4. `node ace migration:run`
5. `node ace db:seed`
6. `node ace server --watch`

### Auth
#### Login
_____
Endpoint:
```
https://127.0.0.1:3333/api/login
```

Payload: 
```json
{
  "email": "admin@email.com",
  "password": "123456"
}
```

#### Register
________
Endpoint:
```
https://127.0.0.1:3333/api/register
```

Payload:
```json
{
  "name": "User Name",
  "email": "user@email.com",
  "password": "userpassword",
  "password_confirmation": "userpassword"
}
```
