import {
  createConnection,
  createLongLivedTokenAuth,
  subscribeEntities,
  callService,
  type HassEntities,
  type Connection,
} from "home-assistant-js-websocket";

// В контейнере HA доступен по этому адресу
const HA_URL = "http://supervisor/core";
const TOKEN = process.env.SUPERVISOR_TOKEN || "";

let connection: Connection | null = null;

export async function getConnection(): Promise<Connection> {
  if (connection) return connection;

  const auth = createLongLivedTokenAuth(HA_URL, TOKEN);
  connection = await createConnection({ auth });
  return connection;
}

export { subscribeEntities, callService };
export type { HassEntities };
