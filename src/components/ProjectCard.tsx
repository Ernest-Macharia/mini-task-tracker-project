import { Project } from "@/types/project";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Circle, Clock } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard = ({ project, onSelect }: ProjectCardProps) => {
  const completedTasks = project.tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = project.tasks.filter((t) => t.status === "in-progress").length;
  const notStartedTasks = project.tasks.filter((t) => t.status === "not-started").length;

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
      onClick={() => onSelect(project)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(project);
        }
      }}
      role="button"
      aria-label={`Open project ${project.name}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {project.name}
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap">
          {completedTasks > 0 && (
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {completedTasks} Completed
            </Badge>
          )}
          {inProgressTasks > 0 && (
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
              <Clock className="h-3 w-3 mr-1" />
              {inProgressTasks} In Progress
            </Badge>
          )}
          {notStartedTasks > 0 && (
            <Badge variant="outline" className="bg-muted">
              <Circle className="h-3 w-3 mr-1" />
              {notStartedTasks} Not Started
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
