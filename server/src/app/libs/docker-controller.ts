import through2 from "through2";
import Docker, { Service } from "dockerode";
import { GeneralConfig } from "./config-file-reader";
import { sleep } from "../../shared/async-utils";
import { logger } from "./logger";
import { Task, TaskStatus } from "../models/task";

export class DockerController {
  private kTickTime = 500;
  private docker: Docker;

  constructor(config: GeneralConfig) {
    this.docker = new Docker(config);
  }

  public async run(task: Task, removeAfterDone = false): Promise<Service> {
    await this.removeServiceForTask(task);
    const service = await this.createServiceForTask(task);
    await this.waitServiceToComplete(service);

    if (removeAfterDone) {
      await this.removeServiceForTask(task);
    }

    return service;
  }

  public async fetchTask(task: Task) {
    logger.debug(`Fetching task ${task.name}`);
    const updatedTask = { ...task };

    const services = await this.docker.listServices();
    const filteredServices = services.filter(
      service => service.Spec.Name === task.name
    );

    if (filteredServices.length === 0) {
      return {
        ...updatedTask,
        status: TaskStatus.notCreated
      };
    }

    if (filteredServices.length > 1) {
      throw new Error(`More than one service found for task ${task.name}`);
    }

    const service = filteredServices[0];
    updatedTask.status = await this.fetchStatusForService({
      ...service,
      id: service.ID
    });
    return updatedTask;
  }

  public async fetchLog(task: Task): Promise<any> {
    logger.debug(`Fetching log from ${task.name}...`);
    const service = await this.fetchServiceForTask(task);
    const stream = await service.logs({
      stdout: true,
      stderr: true,
      follow: true
    });

    const through = through2();
    service.modem.demuxStream(stream, through, through);
    return through;
  }

  private async fetchServiceForTask(task: Task): Promise<any> {
    return this.docker.getService(task.name);
  }

  private async removeServiceForTask(task: Task): Promise<void> {
    logger.debug(`Fetching service from ${task.name} for removal...`);
    const service = await this.fetchServiceForTask(task);
    try {
      await service.remove();
      logger.debug(`Service from ${task.name} removed.`);
    } catch (error) {
      logger.debug(`Service from ${task.name} not found.`);
    }
  }

  private async createServiceForTask(task: Task) {
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

  private async fetchStatusForService(service: Service): Promise<TaskStatus> {
    while (true) {
      const tasks = await this.docker.listTasks();
      const taskForService = tasks.find(task => task.ServiceID === service.id);
      if (!taskForService) {
        return TaskStatus.notCreated;
      }
      return taskForService.Status.State;
    }
  }

  private async waitServiceToComplete(service: Service) {
    logger.debug(`Waiting for service ${service.id} to complete...`);
    while (true) {
      const taskStatus = await this.fetchStatusForService(service);
      if (
        taskStatus === TaskStatus.complete ||
        taskStatus === TaskStatus.failed
      ) {
        break;
      }
      await sleep(this.kTickTime);
    }
  }
}
