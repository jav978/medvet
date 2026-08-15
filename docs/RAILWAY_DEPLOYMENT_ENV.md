# 🚀 Guía de Despliegue en Railway & Variables de Entorno (MedVet Backend)

Este documento detalla todas las **Variables de Entorno (Environment Variables)** necesarias para desplegar el backend de **MedVet (FeathersJS + PostgreSQL + Redis)** en [Railway](https://railway.app/) o [Render](https://render.com/).

---

## 📋 1. Lista de Variables de Entorno para Railway

Copia y pega estas variables en la pestaña **Variables** de tu servicio Backend en Railway:

### 🔹 Variables Esenciales del Servidor y Autenticación

| Variable | Valor Recomendado / Ejemplo | Descripción |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Modo de ejecución optimizado de Node.js. |
| `PORT` | `${{PORT}}` *(Railway la inyecta automáticamente)* | Puerto en el que escucha la API (por defecto 3030 o dinámico de Railway). |
| `HOST` | `0.0.0.0` | Escucha en todas las interfaces de red para permitir tráfico externo. |
| `FEATHERS_AUTH_SECRET` | `medvet_super_secret_jwt_key_2026_prod_xyz987` | Clave secreta para firmar tokens JWT de autenticación. |
| `FRONTEND_URL` | `https://medvet.app` *(o tu URL de Nuxt en Vercel/Railway)* | URL de tu frontend para permitir peticiones CORS y WebSockets seguros. |

---

### 🐘 2. Variables de Base de Datos PostgreSQL (Plugin de Railway)

Cuando agregas el plugin oficial de **PostgreSQL** en tu proyecto de Railway, Railway genera automáticamente una variable llamada `DATABASE_URL`. El backend de MedVet la detecta directamente.

Si configuras las variables de forma individual, puedes usar:

| Variable | Sintaxis / Referencia en Railway | Ejemplo de Valor |
| :--- | :--- | :--- |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | `postgresql://postgres:password@postgres.railway.internal:5432/railway` |
| `DB_HOST` | `${{Postgres.PGHOST}}` | `postgres.railway.internal` |
| `DB_PORT` | `${{Postgres.PGPORT}}` | `5432` |
| `DB_USER` | `${{Postgres.PGUSER}}` | `postgres` |
| `DB_PASSWORD` | `${{Postgres.PGPASSWORD}}` | *(contraseña autogenerada)* |
| `DB_DATABASE` | `${{Postgres.PGDATABASE}}` | `railway` (o `medvet`) |

> 💡 **Recomendación**: Con solo configurar `DATABASE_URL: ${{Postgres.DATABASE_URL}}`, Knex y PostgreSQL se conectarán automáticamente sin necesidad de las variables individuales.

---

### ⚡ 3. Variables de Redis (Caché & Sesiones)

Si agregas el plugin de **Redis** en Railway:

| Variable | Sintaxis / Referencia en Railway | Ejemplo de Valor |
| :--- | :--- | :--- |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` | `redis://default:password@redis.railway.internal:6379` |
| `REDIS_HOST` | `${{Redis.REDISHOST}}` | `redis.railway.internal` |
| `REDIS_PORT` | `${{Redis.REDISPORT}}` | `6379` |
| `REDIS_PASSWORD` | `${{Redis.REDISPASSWORD}}` | *(contraseña autogenerada de Redis)* |

> 💡 **Nota**: El backend maneja la conexión a Redis de forma resiliente y tolerante a fallos; si no usas Redis, la API continuará operando normalmente.

---

## 🛠️ 2. Configuración de Build y Start en Railway

En los **Settings** de tu servicio backend en Railway, asegúrate de configurar:

1. **Root Directory**:
   ```text
   medvet-backend
   ```
   *(¡Muy importante! Como el repositorio es un monorepo con `medvet-backend` y `medvet-frontend`, debes indicarle a Railway que la raíz de este servicio es `medvet-backend`).*

2. **Build Command**:
   ```bash
   npm install && npm run build
   ```

3. **Start Command (Ejecuta migraciones automáticas y levanta la API)**:
   ```bash
   npm run migrate && node lib/index.js
   ```

---

## 📝 3. Bloque para Copiar en Railway (Raw Editor / .env)

```env
# Servidor & Entorno
NODE_ENV=production
PORT=3030
HOST=0.0.0.0
FEATHERS_AUTH_SECRET=medvet_jwt_secret_production_2026_secure_key

# CORS / Conexión con Frontend
FRONTEND_URL=https://tu-frontend-en-vercel-o-railway.app

# Base de datos (Usar referencia de Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (Opcional, usar referencia de Railway)
REDIS_URL=${{Redis.REDIS_URL}}
```

---

## 🔍 4. Explicación del Error en Render (Imagen Adjunta)

En la captura de pantalla de Render se mostraba:
```text
failed to solve: failed to read dockerfile: open Dockerfile: no such file or directory. error: exit status 1
```

### ¿Por qué ocurrió?
1. Render intentó compilar con **Docker** buscando un `Dockerfile` en la raíz del repositorio.
2. Como el proyecto tiene la estructura `/medvet-backend` y `/medvet-frontend`, Render no encontró el archivo en la raíz `/`.

### Solución en Render o Railway:
- **Opción A (Recomendada con Nixpacks/Node)**: En **Settings > Root Directory**, coloca `medvet-backend` y cambia el Environment a **Node**.
- **Opción B (Docker)**: Ya hemos creado el archivo [`medvet-backend/Dockerfile`](file:///home/jav1978/Documents/Desarrollo%202026/Aplicaciones/medvet/medvet-backend/Dockerfile) optimizado en dos etapas (builder + runner). Si usas Docker en Render/Railway, solo debes indicar como **Docker Context** `/` o **Root Directory** `medvet-backend`.
