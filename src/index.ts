import Docker from "dockerode";
import PQueue from "p-queue";
import { CronJob } from "cron";

import { logger } from "./libs/logger";
import { parseConfig, TaskConfig } from "./libs/config-file-reader";

const DEFAULT_MAX_JOBS = 5;

function main(): void {
  const config = parseConfig("./test/example-config.yaml");
  const docker = new Docker();
  const queue = new PQueue({
    concurrency: config.instance.maxJobs || DEFAULT_MAX_JOBS
  });

  function runDockerContainer(task: TaskConfig): () => Promise<void> {
    return async function(): Promise<void> {
      const containerConfig: Docker.ContainerCreateOptions = {
        Image: task.image
      };

      if (task.cmd) {
        containerConfig["Cmd"] = task.cmd.split(" ");
      }
      try {
        const container = await docker.createContainer(containerConfig);
        await container.start();
        logger.info(`Started container for task ${task.name}: ${container.id}`);
      } catch (error) {
        logger.error(error);
      }
    };
  }

  config.tasks.forEach(task => {
    new CronJob(task.cron, () => queue.add(runDockerContainer(task))).start();
    logger.info(`Scheduled task ${task.name} with ${task.cron} cron string`);
  });
}

main();
