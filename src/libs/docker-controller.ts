import Docker, { Service } from "dockerode";
import { GeneralConfig, TaskConfig } from "./config-file-reader";

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class DockerController {
  docker: Docker;
  constructor(config: GeneralConfig) {
    this.docker = new Docker(config);
  }

  async run(task: TaskConfig): Promise<Service> {
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

    // const stream = await service.logs({
    //   stdout: true,
    //   stderr: true,
    //   follow: true
    // });

    // stream.pipe(process.stdout);

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

    await service.remove();
    return service;
  }
}
