# 2. Technical Requirements Document (TRD) — MedVet v1.0

**Document Version:** 1.0.0  
**Status:** Approved / Active  
**Author:** MedVet Engineering Team  
**Last Updated:** Agosto 2026  

---

## 1. Arquitectura General del Sistema

MedVet opera bajo una arquitectura **Cliente-Servidor Desacoplada y Reactiva**, combinando una API orientada a servicios RESTful con un canal de comunicación bidireccional en tiempo real vía WebSockets (**Socket.io**).

```
 ┌────────────────────────────────────────────────────────┐
 │                   FRONTEND CLIENT                      │
 │          Nuxt 3 (Vue 3, Pinia, TypeScript, Nitro)      │
 └──────────────────────────┬─────────────────────────────┘
                            │ HTTPS / WSS
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │               BACKEND APPLICATION SERVER               │
 │           FeathersJS v5 (Dove) + TypeScript            │
 │  ┌──────────────────────────────────────────────────┐  │
 │  │      Koa HTTP Transport & Socket.io Engine       │  │
 │  ├──────────────────────────────────────────────────┤  │
 │  │        Feathers Hooks & RBAC Authorization       │  │
 │  ├──────────────────────────────────────────────────┤  │
 │  │    Services Layer (Appointments, Pets, etc.)     │  │
 │  └──────────────────────────────────────────────────┘  │
 └─────────────┬────────────────────────────┬─────────────┘
               │ Knex.js Pool               │ ioredis
               ▼                            ▼
 ┌───────────────────────────┐ ┌──────────────────────────┐
 │     PostgreSQL 16 (DB)    │ │      Redis 7 (Cache)     │
 │  Relational Data & Indexes│ │ Available Slots & Queues │
 └───────────────────────────┘ └──────────────────────────┘
```

---

## 2. Stack Tecnológico Detallado

### Frontend (`medvet-frontend`)
* **Framework**: [Nuxt 3](https://nuxt.com/) (v3.15+) con motor de servidor Nitro.
* **Lenguaje**: TypeScript 5.x en modo estricto.
* **Gestión de Estado**: Pinia (`useAuthStore`, `useAppointmentStore`, `usePetStore`).
* **Capa de UI & Estilos**:
  - CSS Nativo y Tokens de Diseño Centralizados (`DESIGN.md`).
  - Tailwind CSS + `@nuxt/ui` para primitivas de formulario y componentes accesibles.
  - `@nuxt/icon` con colección local de Heroicons.
* **Cliente de API**: `@feathersjs/client` + `socket.io-client` para sincronización reactiva de estado.
* **Visualización de Datos**: Chart.js / Vue-Chartjs para métricas clínicas y financieras.

### Backend (`medvet-backend`)
* **Framework**: [FeathersJS v5 (Dove)](https://feathersjs.com/) sobre servidor Koa.js.
* **Lenguaje**: TypeScript compilado con `tsx` en desarrollo y `tsc` en producción.
* **Capa de Persistencia & ORM**: Knex.js con controlador nativo `pg` (PostgreSQL client pool).
* **Gestión de Base de Datos**: Migraciones y Seeds programáticos con Knex.
* **Cache & Rendimiento**: Redis 7 con cliente `ioredis` para aceleración de slots de disponibilidad.
* **Autenticación**: `@feathersjs/authentication` con estrategia Local (Email/Password + JWT).
* **Criptografía**: `bcryptjs` para hashing de credenciales.

---

## 3. Especificación de la API de FeathersJS

Los servicios de FeathersJS exponen métodos estándar CRUD (`find`, `get`, `create`, `patch`, `remove`) que se consumen automáticamente vía REST (`/api/v1/...`) o mediante WebSockets (`service.on('created', ...)`).

### Endpoints Principales

| Servicio / Endpoint | Métodos | Roles Permitidos | Descripción |
|---|---|---|---|
| `/authentication` | `POST` | Todos (Público) | Autenticación con email/contraseña; retorna JWT y objeto `user`. |
| `/users` | `find`, `get`, `create`, `patch` | `admin` (todos), `client` (solo su perfil) | Gestión de cuentas de usuario y roles. |
| `/pets` | `find`, `get`, `create`, `patch`, `remove` | `admin`, `veterinarian`, `client` (filtrado por `user_id`) | Ficha de mascotas asociadas a tutores. |
| `/services` | `find`, `get`, `create`, `patch` | Público (`find`, `get`), `admin` (`create`, `patch`) | Catálogo médico, precios, duraciones y categorías. |
| `/professionals` | `find`, `get`, `create`, `patch` | Público (`find`, `get`), `admin` (gestión) | Directorio del cuerpo médico y especialidades. |
| `/schedules` | `find`, `get`, `create`, `patch` | `admin`, `veterinarian` | Horarios laborales de los veterinarios por día de la semana. |
| `/appointments` | `find`, `get`, `create`, `patch`, `remove` | `admin`, `receptionist`, `veterinarian`, `client` | Registro, confirmación y reprogramación de citas médicas. |
| `/available-slots` | `find` | Todos (Público) | Endpoint de cálculo algorítmico de horas disponibles sin colisión. |

---

## 4. Algoritmo de Cálculo de Turnos (`available-slots`)

El cálculo de turnos libres opera según el siguiente algoritmo en backend (`src/services/available-slots/available-slots.class.ts`):

1. **Parámetros de Entrada**: `professionalId`, `serviceId`, `date` (YYYY-MM-DD).
2. **Determinación del Día de la Semana**: Se extrae `dayOfWeek` (0 = Domingo a 6 = Sábado).
3. **Consulta de Horario del Profesional**: Se buscan los bloques de trabajo activos en `schedules` para ese día (ej. `08:00:00` a `17:00:00`).
4. **Consulta de Duración del Servicio**: Se obtiene `duration` en minutos de `services` (ej. Consulta = 30 min, Cirugía = 90 min).
5. **Generación de Slots Candidatos**: Se generan intervalos de `start_time` y `end_time` en pasos de 15/30 minutos dentro del horario laboral.
6. **Filtrado contra Citas Existentes**: Se consultan las citas en `appointments` para esa fecha y profesional que tengan estado `pending` o `confirmed`.
7. **Exclusión de Conflictos**: Se descarta cualquier slot candidato que se superponga con una cita agendada (`candidateStart < bookedEnd && candidateEnd > bookedStart`).
8. **Respuesta Caché**: El resultado se serializa y almacena en Redis con TTL de 60 segundos con invalidación automática ante eventos de creación/cancelación de citas.

---

## 5. Canales de WebSockets & Eventos en Tiempo Real

FeathersJS gestiona canales de difusión en `src/channels.ts`:
* **Canal `authenticated`**: Todos los usuarios autenticados reciben actualizaciones de citas que les conciernen.
* **Canal `admin-clinic`**: Administradores y recepcionistas reciben alertas instantáneas ante cualquier nueva reserva o pago entrante.
* **Eventos Emitidos**:
  - `appointments created`: Notifica nueva reserva y actualiza la agenda de los veterinarios.
  - `appointments patched`: Notifica cambios de estado (confirmada, en consulta, cancelada).
  - `payments completed`: Habilita la actualización en vivo de saldos y reportes de caja.

---

## 6. Seguridad, Autenticación y Autorización (RBAC)

### Pipeline de Hooks de Seguridad
```typescript
// FeathersJS Hooks Flow
context -> [authenticate('jwt')] -> [checkPermissions(role)] -> [setOwnerId] -> Service Execution -> [sanitizeOutput]
```

1. **Autenticación JWT**:
   - Algoritmo: HS256 firmado con clave secreta de entorno (`FEATHERS_AUTH_SECRET`).
   - Expiración predeterminada: 24 horas.
2. **Protección de Datos Sensibles**:
   - El hook `protect('password')` asegura que ningún hash de contraseña sea expuesto en respuestas JSON ni eventos de sockets.
3. **Restricción de Recursos Propios**:
   - Los clientes solo pueden consultar y mutar registros de `pets` y `appointments` cuyo `user_id` coincida con `context.params.user.id`.

---

## 7. Infraestructura, Variables de Entorno y Docker

### Servicios Docker (`docker-compose.yml`)
* **`postgres`**: Imagen `postgres:16-alpine`, puerto mapeado `5432:5432`, volumen persistente `postgres_data`.
* **`redis`**: Imagen `redis:7-alpine`, puerto mapeado `6379:6379`, volumen persistente `redis_data`.

### Variables de Entorno Clave (`.env`)
```bash
# General
NODE_ENV=development
PORT=3030

# Base de Datos
POSTGRES_DB=medvet_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres_password_secure
DATABASE_URL=postgres://postgres:postgres_password_secure@localhost:5432/medvet_db

# Redis Cache
REDIS_URL=redis://localhost:6379

# Seguridad & Autenticación
FEATHERS_AUTH_SECRET=medvet_jwt_super_secret_key_2026_x89a

# Frontend Client
NUXT_PUBLIC_API_URL=http://localhost:3030
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```
