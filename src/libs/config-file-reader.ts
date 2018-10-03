import fs from "fs";
import yaml from "js-yaml";

export interface Config {
  general: GeneralConfig;
  instance: InstanceConfig;
  tasks: TaskConfig[];
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

export interface TaskConfig {
  name: string;
  image: string;
  cmd: string;
  cron: string;
}

export function parseConfig(path: string): Config {
  return yaml.safeLoad(fs.readFileSync(path, "utf8"));
}
