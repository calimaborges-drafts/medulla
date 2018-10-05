import { TasksRunner } from "./app/modules/tasks-runner";
import { parseConfig } from "./app/libs/config-file-reader";
import { RestfulApiServer } from "./app/modules/restful-api-server";
import { DockerController } from "./app/libs/docker-controller";

const kConfigPath =
  process.env.NODE_ENV === "development"
    ? `${__dirname}/../test/example-config.yaml`
    : `${__dirname}/../config.yaml`;

const config = parseConfig(kConfigPath);

const kPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const kMaxJobs = config.instance.maxJobs || 5;

const dockerController = new DockerController(config.general);
const restfulApiServer = new RestfulApiServer(config, kPort);
const taskRunner = new TasksRunner(dockerController, kMaxJobs, config.tasks);

restfulApiServer.start();
taskRunner.start();
