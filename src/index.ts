import Docker from "dockerode";
import { CronJob } from "cron";
import { parseConfig, TaskConfig } from "./libs/config-file-reader";

const cronList: CronJob[] = [];

function addTaskToCron(task: TaskConfig) {}

function main(): void {
  const config = parseConfig("./test/example-config.yaml");
  const docker = new Docker(config.general);
  config.tasks.forEach(addTaskToCron);
}

main();
