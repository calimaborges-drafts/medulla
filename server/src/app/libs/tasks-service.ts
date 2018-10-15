import stream from "stream";
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

  public async fetchTask(name: string): Promise<Task> {
    const filteredTasks = this.config.tasks.filter(task => task.name === name);
    if (filteredTasks.length === 0) {
      throw new Error(`Could not find task with name ${name}`);
    }
    return this.dockerController.fetchTask(filteredTasks[0]);
  }

  public async fetchTasks(): Promise<Task[]> {
    return Promise.all(
      this.config.tasks.map(task => this.dockerController.fetchTask(task))
    );
  }

  public async fetchLogs(task: Task): Promise<stream.Transform> {
    return this.dockerController.fetchLog(task);
  }

  public async start(task: Task): Promise<any> {
    return this.dockerController.run(task);
  }
}
