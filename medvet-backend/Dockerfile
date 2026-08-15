# ─── Stage 1: Build ───
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ─── Stage 2: Production ───
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3030

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/lib ./lib
COPY --from=builder /app/config ./config
COPY --from=builder /app/knexfile.ts ./knexfile.ts
COPY --from=builder /app/public ./public
COPY --from=builder /app/src/migrations ./src/migrations

EXPOSE 3030

CMD ["sh", "-c", "node -r ts-node/register ./node_modules/.bin/knex migrate:latest --knexfile knexfile.ts && node lib/index.js"]
