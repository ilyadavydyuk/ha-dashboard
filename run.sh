#!/bin/sh
echo "Starting HA Dashboard..."

# Запускаем Next.js в фоне
node /app/server.js &

# Ждём пока Next.js поднимется
sleep 3

# Запускаем nginx
nginx -g "daemon off;"
