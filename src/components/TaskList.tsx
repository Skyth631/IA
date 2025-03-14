import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Menu } from '@headlessui/react';

interface Task {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  progress: number;
  tags: string[];
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (id: string) => void;
}

type SortOption = 'dueDate' | 'priority' | 'progress' | 'name';
type FilterOption = 'all' | 'completed' | 'active' | 'high' | 'medium' | 'low';

export default function TaskList({ tasks, onTaskComplete }: TaskListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status/priority filter
    switch (filterBy) {
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'active':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'high':
        filtered = filtered.filter(task => task.priority === 'high');
        break;
      case 'medium':
        filtered = filtered.filter(task => task.priority === 'medium');
        break;
      case 'low':
        filtered = filtered.filter(task => task.priority === 'low');
        break;
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return a.dueDate.getTime() - b.dueDate.getTime();
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'progress':
          return b.progress - a.progress;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [tasks, sortBy, filterBy, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-6"
    >
      {/* Header and Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Task List</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">
                <i className="fas fa-search" />
              </span>
            </div>

            {/* Sort Dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-2">
                <i className="fas fa-sort" />
                Sort by
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-2 z-10">
                {[
                  { value: 'dueDate', label: 'Due Date' },
                  { value: 'priority', label: 'Priority' },
                  { value: 'progress', label: 'Progress' },
                  { value: 'name', label: 'Name' },
                ].map((option) => (
                  <Menu.Item key={option.value}>
                    {({ active }) => (
                      <button
                        className={`w-full text-left px-4 py-2 rounded-lg ${
                          active ? 'bg-teal-50 text-teal-600' : 'text-gray-700'
                        }`}
                        onClick={() => setSortBy(option.value as SortOption)}
                      >
                        {option.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Menu>

            {/* Filter Dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-2">
                <i className="fas fa-filter" />
                Filter
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-2 z-10">
                {[
                  { value: 'all', label: 'All Tasks' },
                  { value: 'active', label: 'Active Tasks' },
                  { value: 'completed', label: 'Completed Tasks' },
                  { value: 'high', label: 'High Priority' },
                  { value: 'medium', label: 'Medium Priority' },
                  { value: 'low', label: 'Low Priority' },
                ].map((option) => (
                  <Menu.Item key={option.value}>
                    {({ active }) => (
                      <button
                        className={`w-full text-left px-4 py-2 rounded-lg ${
                          active ? 'bg-teal-50 text-teal-600' : 'text-gray-700'
                        }`}
                        onClick={() => setFilterBy(option.value as FilterOption)}
                      >
                        {option.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredAndSortedTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-gray-900">{task.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <p className="mt-2 text-gray-600">{task.description}</p>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {task.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onTaskComplete(task.id)}
                    className={`ml-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      task.completed ? 'border-teal-500 bg-teal-500' : 'border-gray-300'
                    }`}
                  >
                    {task.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-white"
                      >
                        <i className="fas fa-check text-sm" />
                      </motion.div>
                    )}
                  </motion.button>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <i className="far fa-calendar" />
                      {format(task.dueDate, 'MMM dd, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fas fa-chart-line" />
                      {task.progress}% Complete
                    </span>
                  </div>
                </div>

                <div className="mt-3 relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-teal-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${task.progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredAndSortedTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-xl shadow-lg"
          >
            <div className="text-gray-400 text-6xl mb-4">
              <i className="fas fa-tasks" />
            </div>
            <h3 className="text-xl font-medium text-gray-600">No tasks found</h3>
            <p className="text-gray-400 mt-2">Try adjusting your filters or search query</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
} 