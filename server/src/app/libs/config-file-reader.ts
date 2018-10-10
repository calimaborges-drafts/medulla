import fs from "fs";
import yaml from "js-yaml";

import { Task } from "../models/task";

export interface Config {
  general: GeneralConfig;
  instance: InstanceConfig;
  tasks: Task[];
}

export interface InstanceConfig {
  maxJobs: number;
}

export interface GeneralConfig {
  socketPath?: string;
  ca?: string;
  cert?: string;
  key?: string;
  host?: string;
  port?: number;
  version?: string;
}

export function parseConfig(path: string): Config {
  return yaml.safeLoad(fs.readFileSync(path, "utf8"));
}
