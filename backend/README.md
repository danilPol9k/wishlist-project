# КупиПодариДай API

Backend-сервис вишлистов на NestJS, PostgreSQL, TypeORM, Passport, JWT и bcrypt.

## Запуск

```bash
npm i
createdb kupipodariday
npm run start:dev
```

По умолчанию используется PostgreSQL: user `student`, password `student`, database `kupipodariday`.
Можно переопределить через переменные окружения:
`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `JWT_SECRET`, `PORT`.

## Основные маршруты

- `POST /auth/signup`
- `POST /auth/signin`
- `GET/PATCH /users/me`
- `POST /users/find`
- `GET /users/:username`
- `POST/GET /wishes`
- `GET /wishes/last`, `GET /wishes/latest`, `GET /wishes/top`
- `GET/PATCH/DELETE /wishes/:id`
- `POST /wishes/:id/copy`
- `POST/GET /offers`
- `POST/GET /wishlists`
- `GET/PATCH/DELETE /wishlists/:id`
