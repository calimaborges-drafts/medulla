import { startTaskRunner } from "./app/modules/task-runner";
import { parseConfig } from "./app/libs/config-file-reader";
import { startRestfulServer } from "./app/modules/restful-api-provider";

const CONFIG_PATH =
  process.env.NODE_ENV === "development"
    ? `${__dirname}/../test/example-config.yaml`
    : `${__dirname}/../config.yaml`;
const DEFAULT_MAX_JOBS = 5;
const RUN_NOW = process.env.NODE_ENV === "development";
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const config = parseConfig(CONFIG_PATH);

startTaskRunner(config, DEFAULT_MAX_JOBS, RUN_NOW);
startRestfulServer(config, PORT);
