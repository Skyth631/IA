import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useMemo, useCallback } from 'react';
import Navigation from './components/Navigation';
import Background3D from './components/Background3D';
import DragDropCalendar from './components/DragDropCalendar';
import TaskList from './components/TaskList';
import StatsDashboard from './components/StatsDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { Task, NavItem } from './types';

// Move mock data outside component to prevent recreation
const mockTasks: Task[] = [
  {
    id: '1',
    name: 'Complete Math Assignment',
    description: 'Finish calculus homework from Chapter 5',
    dueDate: new Date('2024-01-20'),
    priority: 'high',
    progress: 75,
    tags: ['Math', 'Homework'],
    completed: false
  },
  {
    id: '2',
    name: 'Physics Lab Report',
    description: 'Write up results from the pendulum experiment',
    dueDate: new Date('2024-01-18'),
    priority: 'medium',
    progress: 30,
    tags: ['Physics', 'Lab'],
    completed: false
  },
  {
    id: '3',
    name: 'English Essay',
    description: 'Write analysis of Shakespeare\'s Macbeth',
    dueDate: new Date('2024-01-25'),
    priority: 'low',
    progress: 50,
    tags: ['English', 'Essay'],
    completed: false
  }
];

// Navigation items moved outside to prevent recreation
const navItems: ReadonlyArray<NavItem> = [
  {
    id: 'calendar',
    label: 'Calendar',
    icon: 'fas fa-calendar-alt',
    href: '/'
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: 'fas fa-tasks',
    href: '/tasks'
  },
  {
    id: 'stats',
    label: 'Statistics',
    icon: 'fas fa-chart-bar',
    href: '/stats'
  }
];

// Separate component for routes to use useLocation hook
function AppContent() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const location = useLocation();

  const handleTaskComplete = useCallback((taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }, []);

  const handleTaskMove = useCallback((taskId: string, newDate: Date) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, dueDate: newDate }
          : task
      )
    );
  }, []);

  // Memoize task statistics to prevent unnecessary recalculations
  const taskStats = useMemo(() => ({
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => !t.completed && t.dueDate < new Date()).length,
    upcoming: tasks.filter(t => !t.completed && t.dueDate > new Date()).length
  }), [tasks]);

  // Memoize category distribution
  const categoryDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    tasks.forEach(task => {
      task.tags.forEach(tag => {
        distribution[tag] = (distribution[tag] || 0) + 1;
      });
    });
    return distribution;
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Background3D />
      <Navigation
        items={navItems}
        currentPath={location.pathname}
      />
      
      <main className="pl-16 md:pl-64 transition-all duration-300">
        <Routes>
          <Route
            path="/"
            element={
              <DragDropCalendar
                tasks={tasks}
                onTaskComplete={handleTaskComplete}
                onTaskMove={handleTaskMove}
              />
            }
          />
          <Route
            path="/tasks"
            element={
              <TaskList
                tasks={tasks}
                onTaskComplete={handleTaskComplete}
              />
            }
          />
          <Route
            path="/stats"
            element={
              <StatsDashboard
                taskData={taskStats}
                weeklyProgress={[3, 5, 2, 4, 6, 2, 1]}
                categoryDistribution={categoryDistribution}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

// Main App component
export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
} 