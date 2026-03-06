"use client";

import { useEffect, useState, useCallback } from "react";
import {
  createConnection,
  createLongLivedTokenAuth,
  subscribeEntities,
  callService,
  type HassEntities,
  type Connection,
} from "home-assistant-js-websocket";

const MOCK_ENTITIES: HassEntities = {
  "light.living_room": {
    entity_id: "light.living_room",
    state: "on",
    attributes: { friendly_name: "Свет гостиная" },
    last_changed: "",
    last_updated: "",
    context: { id: "", parent_id: null, user_id: null },
  },
  "light.bedroom": {
    entity_id: "light.bedroom",
    state: "off",
    attributes: { friendly_name: "Свет спальня" },
    last_changed: "",
    last_updated: "",
    context: { id: "", parent_id: null, user_id: null },
  },
  "switch.tv": {
    entity_id: "switch.tv",
    state: "off",
    attributes: { friendly_name: "Телевизор" },
    last_changed: "",
    last_updated: "",
    context: { id: "", parent_id: null, user_id: null },
  },
  "sensor.temperature": {
    entity_id: "sensor.temperature",
    state: "22.5",
    attributes: { friendly_name: "Температура", unit_of_measurement: "°C" },
    last_changed: "",
    last_updated: "",
    context: { id: "", parent_id: null, user_id: null },
  },
  "sensor.humidity": {
    entity_id: "sensor.humidity",
    state: "45",
    attributes: { friendly_name: "Влажность", unit_of_measurement: "%" },
    last_changed: "",
    last_updated: "",
    context: { id: "", parent_id: null, user_id: null },
  },
  "climate.thermostat": {
    entity_id: "climate.thermostat",
    state: "heat",
    attributes: {
      friendly_name: "Термостат",
      current_temperature: 21,
      temperature: 23,
    },
    last_changed: "",
    last_updated: "",
    context: { id: "", parent_id: null, user_id: null },
  },
};

const IS_DEV = process.env.NODE_ENV === "development";

export function useEntities(token: string) {
  const [entities, setEntities] = useState<HassEntities>(
    IS_DEV ? MOCK_ENTITIES : {},
  );
  const [connected, setConnected] = useState(IS_DEV);
  const [conn, setConn] = useState<Connection | null>(null);

  useEffect(() => {
    if (IS_DEV) return;
    if (!token) return;

    fetch("./api/ha/token")
      .then((r) => r.json())
      .then(async ({ url }) => {
        const auth = createLongLivedTokenAuth(url, token);
        const connection = await createConnection({ auth });
        setConnected(true);
        setConn(connection);
        subscribeEntities(connection, setEntities);
      })
      .catch(console.error);
  }, [token]);

  const toggle = useCallback(
    (entity_id: string) => {
      if (IS_DEV) {
        // В dev-режиме переключаем локально
        setEntities((prev) => ({
          ...prev,
          [entity_id]: {
            ...prev[entity_id],
            state: prev[entity_id].state === "on" ? "off" : "on",
          },
        }));
        return;
      }
      if (!conn) return;
      const domain = entity_id.split(".")[0];
      callService(conn, domain, "toggle", { entity_id });
    },
    [conn],
  );

  return { entities, connected, toggle };
}
