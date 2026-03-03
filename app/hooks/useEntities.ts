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

export function useEntities(token: string) {
  const [entities, setEntities] = useState<HassEntities>({});
  const [connected, setConnected] = useState(false);
  const [conn, setConn] = useState<Connection | null>(null);

  useEffect(() => {
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
      if (!conn) return;
      const domain = entity_id.split(".")[0];
      callService(conn, domain, "toggle", { entity_id });
    },
    [conn],
  );

  return { entities, connected, toggle };
}
