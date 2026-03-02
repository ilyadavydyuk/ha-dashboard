#!/bin/sh
echo "Starting HA Dashboard..."

node /app/server.js &

sleep 3

# Проверяем доступен ли Next.js
wget -q -O- http://127.0.0.1:3000 > /dev/null && echo "Next.js OK" || echo "Next.js NOT reachable"

nginx -t
nginx -g "daemon off;" || cat /tmp/nginx_error.log
