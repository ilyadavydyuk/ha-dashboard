#!/bin/sh
echo "Starting HA Dashboard..."

HOSTNAME=0.0.0.0 PORT=3000 node /app/server.js &
sleep 3

wget -q -O- http://127.0.0.1:3000 > /dev/null && echo "Next.js OK" || echo "Next.js NOT reachable"

nginx -t
nginx -g "daemon off;"
