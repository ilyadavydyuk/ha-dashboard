# ─── Стадия 1: Сборка Next.js ───────────────────────────────────────────────
# Используем Node 20 Alpine (лёгкий Linux)
FROM node:20-alpine AS builder

WORKDIR /app

# Сначала копируем только package.json — Docker кэширует слои.
# Если код изменился, но зависимости нет — npm ci не перезапустится.
COPY app/package*.json ./
RUN npm ci

# Теперь копируем весь код и собираем
COPY app/ ./
RUN npm run build

# ─── Стадия 2: Продакшн образ ────────────────────────────────────────────────
# Берём чистый Alpine, без dev-зависимостей (~200MB вместо ~800MB)
FROM node:20-alpine

WORKDIR /app

# Next.js standalone mode — всё что нужно для запуска в одном месте
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Скрипт запуска
COPY run.sh /run.sh
RUN chmod +x /run.sh

EXPOSE 3000

CMD ["/run.sh"]
