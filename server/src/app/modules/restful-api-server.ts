const { version } = require("../../../package.json");

import express from "express";
import cors from "cors";
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
    this.config();
    this.routes();
    this.app.listen(this.port, () => logger.info(`Listening app ${this.port}`));
  }

  private config() {
    this.app.use(cors());
  }

  private routes() {
    this.app.get("/", (_, res) =>
      res.send({ env: process.env.NODE_ENV, version })
    );

    this.app.get("/tasks", async (_, res) => {
      try {
        const tasks = await this.tasksService.fetchTasks();
        res.send(JSON.stringify(tasks));
      } catch (error) {
        logger.error(error);
        res.send({ error: error.message.trim() });
      }
    });

    this.app.get("/tasks/:name/logs", async (req, res) => {
      const task = await this.tasksService.fetchTask(req.params.name);
      const logStream = await this.tasksService.fetchLogs(task);

      logStream.on("close", () => console.log("CLOSE"));
      logStream.on("error", () => console.log("ERROR"));
      logStream.on("end", () => console.log("END"));
      logStream.on("finish", () => console.log("FINISH"));

      // logStream.pipe(process.stdout);
    });
  }
}
