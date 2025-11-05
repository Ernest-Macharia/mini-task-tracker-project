import { Task } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Circle, Edit, Trash2 } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskList = ({ tasks, onEdit, onDelete }: TaskListProps) => {
  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      case "not-started":
        return <Circle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case "not-started":
        return (
          <Badge variant="outline" className="bg-muted">
            <Circle className="h-3 w-3 mr-1" />
            Not Started
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-4 bg-card border rounded-lg hover:border-primary transition-colors"
          tabIndex={0}
          role="listitem"
          aria-label={`Task: ${task.title}, Status: ${task.status}, Assignee: ${task.assignee}`}
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="text-muted-foreground">{getStatusIcon(task.status)}</div>
            <div className="flex-1">
              <h4 className="font-medium">{task.title}</h4>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <span>{task.assignee}</span>
                <span>•</span>
                <span>
                  {task.startDate} → {task.endDate}
                </span>
              </div>
            </div>
            {getStatusBadge(task.status)}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
              aria-label={`Edit task ${task.title}`}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task.id)}
              aria-label={`Delete task ${task.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
