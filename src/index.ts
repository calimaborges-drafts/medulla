import PQueue from "p-queue";
import { CronJob } from "cron";
import { logger } from "./libs/logger";
import { parseConfig, TaskConfig } from "./libs/config-file-reader";
import { DockerController } from "./libs/docker-controller";

const RUN_NOW = true;
const DEFAULT_MAX_JOBS = 5;

function main(): void {
  const config = parseConfig("./test/example-config.yaml");
  const dockerController = new DockerController(config.general);
  const queue = new PQueue({
    concurrency: config.instance.maxJobs || DEFAULT_MAX_JOBS
  });

  function runDockerContainer(task: TaskConfig): () => Promise<void> {
    return async function() {
      try {
        logger.info(`Running ${task.name} using ${task.image}`);
        await dockerController.run(task);
        logger.info(`Done ${task.name}`);
      } catch (error) {
        logger.error(error);
      }
    };
  }

  config.tasks.forEach(task => {
    if (RUN_NOW) {
      queue.add(runDockerContainer(task));
    } else {
      new CronJob(task.cron, () => queue.add(runDockerContainer(task))).start();
      logger.info(`Scheduled task ${task.name} with ${task.cron} cron string`);
    }
  });
}

main();
