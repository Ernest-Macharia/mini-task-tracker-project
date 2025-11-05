Mini Task Tracker Dashboard (Gantt-Style)
Overview

The Mini Task Tracker Dashboard is a lightweight yet powerful project management tool featuring Gantt chart visualization, task tracking, and team collaboration. It enables users to create, manage, and visualize project timelines and progress efficiently.

Built with React, TypeScript, and Tailwind CSS, the dashboard emphasizes accessibility, responsiveness, and clean architecture.

Features
Category	Description
Project Management - Create and manage projects with tasks, subtasks, and dependencies.
Gantt Chart - Visualization	Visualize project timelines with start and end dates, progress bars, and today indicators.
Task Tracking	- Track the status (Not Started, In Progress, Completed) and deadlines of tasks.
Team Collaboration	- Assign tasks to team members and collaborate using comments or updates.
Keyboard Navigation -	Move between tasks using arrow keys and open details using Enter.
Zoom & Filters -Filter tasks by status or assignee and toggle between Day/Week views.
Accessibility	- WCAG-compliant design with ARIA roles, focus outlines, and keyboard support.
Responsive - Design	Seamless experience across desktop, tablet, and mobile screens.

Tech Stack
Layer	Technology
Frontend - React + TypeScript
Styling	- Tailwind CSS + Radix UI + Lucide React
State Management	- React Context API
Build Tool	- Vite
Data Handling	- In-memory JSON
Deployment	- Docker + Docker Compose

Installation
1. Clone the repository
git clone https://github.com/your-username/mini-task-tracker-project.git
cd mini-task-tracker-project

2. Install dependencies
npm install

3. Start the development server
npm run dev

4. Docker
docker compose up --build

Usage Guide
Add tasks with title, start date, end date, assignee, and status.
View the Gantt Chart to visualize all tasks.
Filter or search by status or assignee.
Use keyboard controls:
Arrow Keys/Tab → Navigate between tasks
Enter → Open task details
Update task progress or mark as completed.