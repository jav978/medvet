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

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/config ./config
COPY --from=builder /app/knexfile.js ./knexfile.js
COPY --from=builder /app/migrate-prod.js ./migrate-prod.js

# Ensure public and uploads directories exist
RUN mkdir -p /app/public/uploads

EXPOSE 3030

CMD ["sh", "-c", "node migrate-prod.js && node lib/index.js"]
