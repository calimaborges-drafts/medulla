const { version } = require("../../../package.json");

import express from "express";
import { logger } from "../libs/logger";
import { Config } from "../libs/config-file-reader";

export class RestfulApiServer {
  private config: Config;
  private port: number;
  private app: express.Application;

  constructor(config: Config, port: number) {
    this.config = config;
    this.port = port;
    this.app = express();
  }

  public start() {
    this.routes();
    this.app.listen(this.port, () => logger.info(`Listening app ${this.port}`));
  }

  private routes() {
    this.app.get("/", (_, res) =>
      res.send({ env: process.env.NODE_ENV, version })
    );

    this.app.get("/tasks", (_, res) =>
      res.send(JSON.stringify(this.config.tasks))
    );
  }
}
