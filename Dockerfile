# ─── Стадия 1: Сборка Next.js ────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY app/package*.json ./
RUN npm ci

COPY app/ ./
RUN npm run build

# ─── Стадия 2: Продакшн образ ────────────────────────────────────────────────
FROM node:20-alpine

# Устанавливаем nginx
RUN apk add --no-cache nginx

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Копируем конфиг nginx
COPY nginx.conf /etc/nginx/nginx.conf

COPY run.sh /run.sh
RUN chmod +x /run.sh

# nginx слушает на 8099 (стандарт для HA Ingress)
EXPOSE 8099

CMD ["/run.sh"]
