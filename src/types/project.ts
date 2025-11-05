export type TaskStatus = "not-started" | "in-progress" | "completed";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assignee: string;
  startDate: string;
  endDate: string;
  dependencies?: string[];
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
}
