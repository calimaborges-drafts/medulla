import { Task } from "../models/task";
import { Config } from "./config-file-reader";
import { DockerController } from "./docker-controller";

export class TasksService {
  private config: Config;
  private dockerController: DockerController;

  constructor(config: Config, dockerController: DockerController) {
    this.config = config;
    this.dockerController = dockerController;
  }

  public async fetchTasks(): Promise<Task[]> {
    return Promise.all(
      this.config.tasks.map(task => this.dockerController.fetchTask(task))
    );
  }
}
