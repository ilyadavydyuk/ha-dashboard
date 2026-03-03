#!/bin/sh
echo "Ingress entry: $(bashio::addon.ingress_entry)"
HOSTNAME=0.0.0.0 PORT=3000 node /app/server.js
