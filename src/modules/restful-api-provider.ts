import express from "express";
import { logger } from "../libs/logger";
import { Config } from "../libs/config-file-reader";
const { version } = require("../../package.json");

export function startRestfulServer(config: Config, port: number): void {
  const app = express();

  app.get("/", (_, res) => res.send({ env: process.env.NODE_ENV, version }));

  app.get("/tasks", (_, res) => res.send(JSON.stringify(config.tasks)));

  app.listen(port, () => logger.info(`Listening app ${port}`));
}
