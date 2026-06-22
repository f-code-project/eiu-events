# Infrastructure Rules

## Docker Compose Services

```yaml
services:
  mysql:
    image: mysql:8.0
    ports: ["3306:3306"]
    environment:
      MYSQL_ROOT_PASSWORD: fstyle_crew
      MYSQL_DATABASE: fstyle_crew
    volumes:
      - mysql_data:/var/lib/mysql

  phpmyadmin:
    image: phpmyadmin
    ports: ["8080:80"]
    environment:
      PMA_HOST: mysql

  redis:
    image: redis:7
    ports: ["6379:6379"]
```

## Ports

| Service           | Port | URL                    |
| ----------------- | ---- | ---------------------- |
| Frontend (Vite)   | 5173 | http://localhost:5173  |
| Backend (Express) | 8000 | http://localhost:8000  |
| MySQL             | 3306 | mysql://localhost:3306 |
| phpMyAdmin        | 8080 | http://localhost:8080  |
| Redis             | 6379 | redis://localhost:6379 |

## CORS

Backend allows frontend origin only:

- Development: `http://localhost:5173`
- Production: `process.env.CLIENT_URL`
- `credentials: true` for cookie support

## Database

- MySQL 8.0 via Docker
- Managed by Drizzle ORM
- Connection string in `DATABASE_URL` env var
- Default: `mysql://root:fstyle_crew@localhost:3306/fstyle_crew`

## Redis

- Redis 7 via Docker
- Used for: token storage, rate limiting, BullMQ job queue
- Connection via `ioredis` client
- Config in `src/configs/redis.ts`

## Email (SMTP)

- Gmail SMTP (`smtp.gmail.com:587`)
- Credentials in env vars: `SMTP_USER`, `SMTP_PASS`
- `DEV_EMAIL_RECEIVER` overrides recipient in development mode
- Templates rendered with Handlebars
