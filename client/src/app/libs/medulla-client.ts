// TODO: Usar algo como workspaces para reutilizar esse código
export enum TaskStatus {
  complete = "complete",
  preparing = "preparing",
  starting = "starting",
  running = "running",
  notCreated = "not_created",
  failed = "failed"
}

export interface Task {
  name: string;
  status: TaskStatus;
}

export class MedullaClient {
  private baseUrl = "http://localhost:3000";

  public async fetchTasks(): Promise<Task[]> {
    const response = await fetch(`${this.baseUrl}/tasks`);
    return response.json();
  }

  public async fetchLog(task: Task): Promise<string> {
    const response = await fetch(`${this.baseUrl}/tasks/${task.name}/logs`);
    return response.text();
  }
}
