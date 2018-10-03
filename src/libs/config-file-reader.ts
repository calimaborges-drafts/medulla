import fs from "fs";
import yaml from "js-yaml";

export interface Config {
  general: GeneralConfig;
  tasks: TaskConfig[];
}

export interface GeneralConfig {
  ca: string;
  cert: string;
  key: string;
  host: string;
  port: number;
  version: string;
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
