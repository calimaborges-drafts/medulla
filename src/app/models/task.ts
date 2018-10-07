export enum TaskStatus {
  complete = "complete",
  pending = "pending",
  running = "running",
  notCreated = "not_created",
  failed = "failed"
}

export interface Task {
  name: string;
  image: string;
  cron?: string;
  status?: TaskStatus;
}
