import PQueue from "p-queue";
import { CronJob } from "cron";
import { logger } from "../libs/logger";
import { Task } from "../models/task";
import { DockerController } from "../libs/docker-controller";

export class TasksRunner {
  private dockerController: DockerController;
  private queue: PQueue;
  private tasks: Task[];

  constructor(
    dockerController: DockerController,
    concurrency: number,
    tasks: Task[]
  ) {
    this.dockerController = dockerController;
    this.queue = new PQueue({ concurrency });
    this.tasks = tasks;
  }

  public async start() {
    try {
      logger.info("Testing Swarm connection...");
      await this.testSwarmConnection();
    } catch (error) {
      logger.error(
        `Could not connect to swarm. Please verify your general configuration. 
        ** TASK RUNNER WILL NOT START **`
      );
      logger.error(error);
      return;
    }

    this.tasks.forEach(task => {
      if (task.cron) {
        this.scheduleTask(task);
      } else {
        this.enqueueTask(task);
      }
    });
  }

  private async testSwarmConnection() {
    const testTask = {
      name: "test-task",
      image: "hello-world"
    };
    await this.dockerController.run(testTask, true);
  }

  private scheduleTask(task: Task) {
    if (task.cron) {
      const cronJob = new CronJob(task.cron, () => this.enqueueTask(task));
      cronJob.start();
      logger.info(`Scheduled task ${task.name} with ${task.cron} cron string`);
    } else {
      this.enqueueTask(task);
    }
  }

  private enqueueTask(task: Task) {
    this.queue.add(() => this.runTask(task));
    logger.info(`Queued task ${task.name} for running`);
  }

  private async runTask(task: Task) {
    try {
      logger.info(`Running task ${task.name}`);
      await this.dockerController.run(task);
      logger.info(`Task ${task.name} done`);
    } catch (error) {
      logger.error(`Task ${task.name} failed`);
      logger.error(error);
    }
  }
}
