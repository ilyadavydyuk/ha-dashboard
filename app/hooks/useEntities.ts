"use client";

import { useEffect, useState } from "react";
import {
  createConnection,
  createLongLivedTokenAuth,
  subscribeEntities,
  type HassEntities,
} from "home-assistant-js-websocket";

export function useEntities(token: string) {
  const [entities, setEntities] = useState<HassEntities>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    fetch("./api/ha/token")
      .then((r) => r.json())
      .then(async ({ url }) => {
        const auth = createLongLivedTokenAuth(url, token);
        const conn = await createConnection({ auth });
        setConnected(true);
        subscribeEntities(conn, setEntities);
      })
      .catch(console.error);
  }, [token]);

  return { entities, connected };
}
