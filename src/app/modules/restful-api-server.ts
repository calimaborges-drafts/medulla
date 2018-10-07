const { version } = require("../../../package.json");

import express from "express";
import { logger } from "../libs/logger";
import { TasksService } from "../libs/tasks-service";

export class RestfulApiServer {
  private port: number;
  private app: express.Application;
  private tasksService: TasksService;

  constructor(port: number, tasksService: TasksService) {
    this.port = port;
    this.tasksService = tasksService;
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

    this.app.get("/tasks", async (_, res) => {
      try {
        res.send(JSON.stringify(await this.tasksService.fetchTasks()));
      } catch (error) {
        logger.error(error);
        res.send({ error: error.message.trim() });
      }
    });
  }
}
