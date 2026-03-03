#!/bin/sh
echo "Starting HA Dashboard..."
HOSTNAME=0.0.0.0 PORT=3000 node /app/server.js 2>&1
