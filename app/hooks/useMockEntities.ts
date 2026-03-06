import { type HassEntities } from "home-assistant-js-websocket";

export const mockEntities: HassEntities = {
  "light.living_room": {
    entity_id: "light.living_room",
    state: "on",
    attributes: { friendly_name: "Свет в гостиной", brightness: 200 },
    last_changed: "",
    last_updated: "",
    context: { id: "", parent_id: null, user_id: null },
  },
  "light.bedroom": {
    entity_id: "light.bedroom",
    state: "off",
    attributes: { friendly_name: "Свет в спальне" },
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
