#!/bin/sh
echo "Starting HA Dashboard..."

# Запускаем Next.js в фоне
node /app/server.js &

# Запускаем nginx на переднем плане
nginx -g "daemon off;"
