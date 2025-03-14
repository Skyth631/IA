import React, { useState, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Calendar from './components/Calendar';
import TaskList from './components/TaskList';
import StatsDashboard from './components/StatsDashboard';
import HomePage from './components/HomePage';
import ErrorBoundary from './components/ErrorBoundary';
import { Task, NavItem } from './types';

// Mock data moved outside component to prevent recreation
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

const navItems: ReadonlyArray<NavItem> = [
  { label: 'Home', path: '/', icon: '🏠' },
  { label: 'Calendar', path: '/calendar', icon: '📅' },
  { label: 'Tasks', path: '/tasks', icon: '📝' },
  { label: 'Statistics', path: '/stats', icon: '📊' },
  { label: 'Categories', path: '/categories', icon: '🏷️' },
  { label: 'Settings', path: '/settings', icon: '⚙️' }
];

function AppContent() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [currentPath, setCurrentPath] = useState('/');

  const handleTaskComplete = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
  }, []);

  const handleTaskMove = useCallback((taskId: string, newDate: Date) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, dueDate: newDate } : task
    ));
  }, []);

  // Memoize task statistics
  const taskStats = useMemo(() => {
    const now = new Date();
    return {
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed && new Date(t.dueDate) >= now).length,
      overdue: tasks.filter(t => !t.completed && new Date(t.dueDate) < now).length,
      upcoming: tasks.filter(t => !t.completed && new Date(t.dueDate) > now).length
    };
  }, [tasks]);

  // Memoize category distribution
  const categoryDistribution = useMemo(() => {
    return tasks.reduce((acc, task) => {
      task.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
  }, [tasks]);

  // Memoize weekly progress
  const weeklyProgress = useMemo(() => {
    // Mock weekly progress data
    return [4, 6, 2, 8, 5, 7, 3];
  }, []);

  return (
    <div className="app">
      <Navigation
        items={navItems}
        onNavigate={setCurrentPath}
        currentPath={currentPath}
      />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/calendar"
                element={<Calendar tasks={tasks} onTaskMove={handleTaskMove} />}
              />
              <Route
                path="/tasks"
                element={<TaskList tasks={tasks} onComplete={handleTaskComplete} />}
              />
              <Route
                path="/stats"
                element={
                  <StatsDashboard
                    taskData={taskStats}
                    weeklyProgress={weeklyProgress}
                    categoryDistribution={categoryDistribution}
                  />
                }
              />
              <Route
                path="/categories"
                element={<div>Categories Page (Coming Soon)</div>}
              />
              <Route
                path="/settings"
                element={<div>Settings Page (Coming Soon)</div>}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
} 