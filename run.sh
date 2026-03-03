#!/bin/sh

# Получаем ingress path через Supervisor REST API
INGRESS_PATH=$(wget -qO- \
  --header="Authorization: Bearer ${SUPERVISOR_TOKEN}" \
  http://supervisor/addons/self/info \
  | grep -o '"ingress_entry":"[^"]*"' \
  | cut -d'"' -f4)

echo "Ingress path: $INGRESS_PATH"

HOSTNAME=0.0.0.0 PORT=3000 node /app/server.js
