# MedVet Responsive Booking System

Sistema de reservas para clínicas veterinarias.

## Stack

- **Frontend:** Nuxt.js v4 + Nuxt UI v4 + Tailwind CSS + Pinia
- **Backend:** FeathersJS v5 + Sequelize v6 + PostgreSQL 18
- **Cache:** Redis 7
- **CMS:** Directus
- **Infra:** Docker Compose

## Desarrollo

```bash
# Levantar servicios Docker
docker compose up -d

# Backend
cd medvet-backend
npm install
npm run dev

# Frontend
cd medvet-frontend
npm install
npm run dev
```

## Servicios Docker

| Servicio | URL |
|----------|-----|
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |
| pgAdmin | http://localhost:5050 |
| Directus | http://localhost:8055 |
| Feathers API | http://localhost:3030 |
| Nuxt Dev | http://localhost:3000 |

## Licencia

MIT
