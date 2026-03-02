#!/bin/sh
echo "Starting HA Dashboard..."

node /app/server.js &

sleep 3

nginx -t
nginx -g "daemon off;" || cat /tmp/nginx_error.log
