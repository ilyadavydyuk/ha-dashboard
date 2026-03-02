#!/bin/sh
echo "Starting HA Dashboard..."

node /app/server.js &

sleep 3

# Проверяем конфиг nginx перед запуском
nginx -t

nginx -g "daemon off;"
