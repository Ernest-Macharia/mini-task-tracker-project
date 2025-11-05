import { useState, useMemo } from "react";
import { Project, Task, TaskStatus } from "@/types/project";
import { mockProjects } from "@/data/mockData";
import { ProjectCard } from "@/components/ProjectCard";
import { GanttChart } from "@/components/GanttChart";
import { TaskList } from "@/components/TaskList";
import { TaskForm } from "@/components/TaskForm";
import { FilterBar } from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, LayoutGrid, List } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"gantt" | "list">("gantt");

  // Get all unique assignees from selected project
  const assignees = useMemo(() => {
    if (!selectedProject) return [];
    const uniqueAssignees = new Set(selectedProject.tasks.map((task) => task.assignee));
    return Array.from(uniqueAssignees).sort();
  }, [selectedProject]);

  // Filter tasks based on search and filters
  const filteredTasks = useMemo(() => {
    if (!selectedProject) return [];

    return selectedProject.tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesAssignee = assigneeFilter === "all" || task.assignee === assigneeFilter;
      return matchesSearch && matchesStatus && matchesAssignee;
    });
  }, [selectedProject, searchQuery, statusFilter, assigneeFilter]);

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (!selectedProject) return;

    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === selectedProject.id) {
          if (editingTask) {
            // Update existing task
            const updatedTasks = project.tasks.map((task) =>
              task.id === editingTask.id ? { ...task, ...taskData } : task
            );
            setSelectedProject({ ...project, tasks: updatedTasks });
            toast.success("Task updated successfully");
            return { ...project, tasks: updatedTasks };
          } else {
            // Add new task
            const newTask: Task = {
              id: `task-${Date.now()}`,
              title: taskData.title || "",
              status: taskData.status || "not-started",
              assignee: taskData.assignee || "",
              startDate: taskData.startDate || "",
              endDate: taskData.endDate || "",
              projectId: selectedProject.id,
            };
            const updatedTasks = [...project.tasks, newTask];
            setSelectedProject({ ...project, tasks: updatedTasks });
            toast.success("Task created successfully");
            return { ...project, tasks: updatedTasks };
          }
        }
        return project;
      })
    );

    setEditingTask(undefined);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!selectedProject) return;

    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === selectedProject.id) {
          const updatedTasks = project.tasks.filter((task) => task.id !== taskId);
          setSelectedProject({ ...project, tasks: updatedTasks });
          toast.success("Task deleted successfully");
          return { ...project, tasks: updatedTasks };
        }
        return project;
      })
    );
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setSearchQuery("");
    setStatusFilter("all");
    setAssigneeFilter("all");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {selectedProject && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToProjects}
                  aria-label="Back to projects"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {selectedProject ? selectedProject.name : "Project Manager"}
                </h1>
                {selectedProject && (
                  <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                )}
              </div>
            </div>
            {selectedProject && (
              <Button onClick={handleAddTask} aria-label="Add new task">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!selectedProject ? (
          <div>
            <h2 className="text-lg font-semibold mb-2">Dashboard</h2>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Your Projects</h2>
              <p className="text-muted-foreground">
                Select a project to view and manage its tasks
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} onSelect={setSelectedProject} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              assigneeFilter={assigneeFilter}
              onAssigneeFilterChange={setAssigneeFilter}
              assignees={assignees}
            />

            <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
              <TabsList>
                <TabsTrigger value="gantt" className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Gantt View
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  List View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="gantt" className="mt-6">
                {filteredTasks.length > 0 ? (
                  <GanttChart tasks={filteredTasks} onTaskClick={handleEditTask} />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No tasks found matching your filters.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="list" className="mt-6">
                {filteredTasks.length > 0 ? (
                  <TaskList tasks={filteredTasks} onEdit={handleEditTask} onDelete={handleDeleteTask} />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No tasks found matching your filters.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {selectedProject && (
        <TaskForm
          task={editingTask}
          projectId={selectedProject.id}
          open={isTaskFormOpen}
          onClose={() => {
            setIsTaskFormOpen(false);
            setEditingTask(undefined);
          }}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default Index;
