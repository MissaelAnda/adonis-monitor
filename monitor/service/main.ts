import app from "@adonisjs/core/services/app";
import MonitorManager from "../manager.js";

let monitor: MonitorManager;

await app.booted(async () => {
  monitor = await app.container.make(MonitorManager);
});

export { monitor as default };