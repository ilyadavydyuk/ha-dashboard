#!/bin/sh

# Получаем ingress path
INGRESS_PATH=$(wget -qO- \
  --header="Authorization: Bearer ${SUPERVISOR_TOKEN}" \
  http://supervisor/addons/self/info \
  | grep -o '"ingress_entry":"[^"]*"' \
  | cut -d'"' -f4)

echo "Ingress path: $INGRESS_PATH"

# Собираем Next.js с правильным assetPrefix
NEXT_PUBLIC_ASSET_PREFIX=$INGRESS_PATH npm run build

# Запускаем
HOSTNAME=0.0.0.0 PORT=3000 node .next/standalone/server.js
