import { useMemo, useRef, useEffect, useState } from "react";
import { Task } from "@/types/project";
import {
  format,
  differenceInDays,
  parseISO,
  startOfDay,
  addDays,
} from "date-fns";

interface GanttChartProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export const GanttChart = ({ tasks, onTaskClick }: GanttChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<"day" | "week">("day");

  // Calculate timeline bounds
  const { startDate, endDate, totalDays } = useMemo(() => {
    if (tasks.length === 0) {
      const today = new Date();
      return {
        startDate: today,
        endDate: addDays(today, 30),
        totalDays: 30,
      };
    }

    const dates = tasks.flatMap((task) => [
      parseISO(task.startDate),
      parseISO(task.endDate),
    ]);
    const start = startOfDay(
      new Date(Math.min(...dates.map((d) => d.getTime())))
    );
    const end = startOfDay(new Date(Math.max(...dates.map((d) => d.getTime()))));
    const days = differenceInDays(end, start) + 1;

    return {
      startDate: start,
      endDate: end,
      totalDays: Math.max(days, 7),
    };
  }, [tasks]);

  // Zoom scaling
  const daysPerColumn = zoom === "day" ? 1 : 7;

  // Generate timeline grid
  const timelineGrid = useMemo(() => {
    const grid: Date[] = [];
    for (let i = 0; i < totalDays; i += daysPerColumn) {
      grid.push(addDays(startDate, i));
    }
    return grid;
  }, [startDate, totalDays, daysPerColumn]);

  // Calculate task position and width
  const getTaskStyle = (task: Task) => {
    const taskStart = parseISO(task.startDate);
    const taskEnd = parseISO(task.endDate);
    const daysFromStart = differenceInDays(startOfDay(taskStart), startDate);
    const duration =
      differenceInDays(startOfDay(taskEnd), startOfDay(taskStart)) + 1;

    const columnWidth = 100 / (totalDays / daysPerColumn);
    const left = (daysFromStart / daysPerColumn) * columnWidth;
    const width = (duration / daysPerColumn) * columnWidth;

    return {
      left: `${left}%`,
      width: `${width}%`,
    };
  };

  // Get status color class
  const getStatusClass = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-gantt-bar-completed";
      case "in-progress":
        return "bg-gantt-bar-in-progress";
      case "not-started":
        return "bg-gantt-bar-not-started";
    }
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = startOfDay(new Date());
    return startOfDay(date).getTime() === today.getTime();
  };

  // Get today's position
  const getTodayPosition = () => {
    const today = startOfDay(new Date());
    const daysFromStart = differenceInDays(today, startDate);
    if (daysFromStart < 0 || daysFromStart >= totalDays) return null;
    const columnWidth = 100 / (totalDays / daysPerColumn);
    return `${(daysFromStart / daysPerColumn) * columnWidth}%`;
  };

  const todayPosition = getTodayPosition();

  useEffect(() => {
    // Scroll to today's position if visible
    if (todayPosition && containerRef.current) {
      const scrollPosition =
        (parseFloat(todayPosition) / 100) * containerRef.current.scrollWidth;
      containerRef.current.scrollLeft = Math.max(
        0,
        scrollPosition - containerRef.current.clientWidth / 2
      );
    }
  }, [todayPosition]);

  if (tasks.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center text-muted-foreground">
        No tasks to display
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Gantt timeline"
      className="bg-card rounded-lg border overflow-hidden relative"
    >
      {/* Zoom Controls */}
      <div className="absolute right-4 top-3 flex gap-2 z-30">
        <button
          onClick={() => setZoom("day")}
          className={`px-2 py-1 text-xs rounded border ${
            zoom === "day" ? "bg-primary text-white" : "bg-muted"
          }`}
        >
          Day
        </button>
        <button
          onClick={() => setZoom("week")}
          className={`px-2 py-1 text-xs rounded border ${
            zoom === "week" ? "bg-primary text-white" : "bg-muted"
          }`}
        >
          Week
        </button>
      </div>

      <div className="overflow-x-auto" ref={containerRef}>
        <div className="min-w-[800px]">
          {/* Timeline Header */}
          <div className="flex border-b bg-muted/30">
            <div className="w-48 flex-shrink-0 p-3 font-medium border-r">
              Task
            </div>
            <div className="flex-1 relative">
              <div className="flex">
                {timelineGrid.map((date, index) => (
                  <div
                    key={index}
                    className={`flex-1 p-2 text-center text-xs border-r last:border-r-0 ${
                      isToday(date) ? "bg-gantt-today/10 font-semibold" : ""
                    }`}
                  >
                    <div>{format(date, "MMM d")}</div>
                    <div className="text-muted-foreground">
                      {format(date, "EEE")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Task Rows */}
          <div className="relative">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex hover:bg-muted/20 transition-colors border-b last:border-b-0"
              >
                <div className="w-48 flex-shrink-0 p-3 border-r flex items-center">
                  <div className="truncate">
                    <div className="font-medium text-sm truncate">
                      {task.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {task.assignee}
                    </div>
                  </div>
                </div>
                <div className="flex-1 relative h-16">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex">
                    {timelineGrid.map((_, index) => (
                      <div
                        key={index}
                        className="flex-1 border-r last:border-r-0 border-gantt-grid"
                      />
                    ))}
                  </div>

                  {/* Today marker */}
                  {todayPosition && (
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-gantt-today z-10 shadow-[0_0_6px_rgba(255,0,0,0.4)]"
                      style={{ left: todayPosition }}
                      aria-hidden="true"
                    />
                  )}

                  {/* Task bar */}
                  <div
                    className={`group absolute top-1/2 -translate-y-1/2 h-8 rounded ${getStatusClass(
                      task.status
                    )} cursor-pointer hover:opacity-80 transition-opacity z-20 flex items-center px-2 shadow-sm`}
                    style={getTaskStyle(task)}
                    onClick={() => onTaskClick?.(task)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Task: ${task.title}, Status: ${task.status}, From ${task.startDate} to ${task.endDate}`}
                  >
                    <span className="text-xs font-medium text-white truncate">
                      {task.title}
                    </span>

                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      {`${task.title} • ${format(
                        parseISO(task.startDate),
                        "MMM d"
                      )} → ${format(
                        parseISO(task.endDate),
                        "MMM d"
                      )} • ${task.status}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 p-3 border-t bg-muted/30 text-xs">
        <span className="text-muted-foreground font-medium">Legend:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gantt-bar-completed" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gantt-bar-in-progress" />
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gantt-bar-not-started" />
          <span>Not Started</span>
        </div>
        {todayPosition && (
          <div className="flex items-center gap-2 ml-4">
            <div className="w-0.5 h-4 bg-gantt-today" />
            <span>Today</span>
          </div>
        )}
      </div>
    </div>
  );
};
