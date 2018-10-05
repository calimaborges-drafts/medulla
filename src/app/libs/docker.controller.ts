import Docker, { Service } from "dockerode";
import { GeneralConfig, TaskConfig } from "./config-file-reader";
import { sleep } from "../../shared/async-utils";
import { logger } from "./logger";

export class DockerController {
  private docker: Docker;

  constructor(config: GeneralConfig) {
    this.docker = new Docker(config);
  }

  async run(task: TaskConfig): Promise<Service> {
    await this.__removeServiceForTask(task);
    const service = await this.__createServiceForTask(task);
    await this.__waitServiceToComplete(service);

    // const stream = await service.logs({
    //   stdout: true,
    //   stderr: true,
    //   follow: true
    // });

    // stream.pipe(process.stdout);

    return service;
  }

  async __removeServiceForTask(task: TaskConfig): Promise<void> {
    logger.debug(`Fetching service from ${task.name} for removal...`);
    const service = this.docker.getService(task.name);
    try {
      await service.remove();
      logger.debug(`Service from ${task.name} removed.`);
    } catch (error) {
      logger.debug(`Service from ${task.name} not found.`);
    }
  }

  async __createServiceForTask(task: TaskConfig) {
    logger.debug(`Creating service from ${task.name}...`);
    const service = await this.docker.createService({
      Name: task.name,
      TaskTemplate: {
        ContainerSpec: {
          Image: task.image
        },
        RestartPolicy: {
          MaxAttempts: 1,
          Condition: "none"
        }
      }
    });
    logger.debug(`Service from ${task.name} created: ${service.id}`);
    return service;
  }

  async __waitServiceToComplete(service: Service) {
    logger.debug(`Waiting for service ${service.id} to complete...`);
    while (true) {
      const tasks = await this.docker.listTasks();
      const taskForService = tasks.find(task => task.ServiceID === service.id);
      if (
        taskForService.Status.State === "complete" ||
        taskForService.Status.State === "failed"
      ) {
        break;
      } else {
        await sleep(1000);
      }
    }
  }
}
