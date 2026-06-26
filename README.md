# КупиПодариДай — Docker Compose

Проект состоит из трёх сервисов:

- `backend` — NestJS API;
- `frontend` — React-приложение, раздаётся через nginx;
- `database` — PostgreSQL.

## Локальный запуск

```bash
cp .env.example .env
docker-compose up --build
```

После запуска:

- Frontend: http://localhost:8081
- Backend: http://localhost:4000

## Переменные окружения

Заполните `.env` по примеру `.env.example`. Файл `.env` не нужно коммитить в репозиторий.

Для локальной проверки можно оставить:

```env
FRONTEND_API_URL=http://localhost:4000
```

Для деплоя замените на домен backend:

```env
FRONTEND_API_URL=https://api.<ваш-домен>
```

После изменения `FRONTEND_API_URL` нужно пересобрать frontend-контейнер:

```bash
docker-compose up --build -d frontend
```

## Данные сервера

IP адрес 158.160.128.60  
Frontend https://dan460-wishlist.nomorepartiessite.ru 
Backend https://api.dan460-wishlist.nomorepartiessite.ru
