"use client";

import { useEffect, useState } from "react";
import {
  createConnection,
  createLongLivedTokenAuth,
  subscribeEntities,
  type HassEntities,
} from "home-assistant-js-websocket";

export function useEntities() {
  const [entities, setEntities] = useState<HassEntities>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Получаем токен и URL от нашего API route
    // (не хардкодим — токен не должен быть в браузере)
    fetch("/api/ha/token")
      .then((r) => r.json())
      .then(async ({ url, token }) => {
        const auth = createLongLivedTokenAuth(url, token);
        const conn = await createConnection({ auth });
        setConnected(true);
        subscribeEntities(conn, setEntities);
      })
      .catch(console.error);
  }, []);

  return { entities, connected };
}
