import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { format } from 'date-fns';
import confetti from 'react-confetti';

interface TaskCardProps {
  task: {
    id: string;
    name: string;
    description: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high';
    progress: number;
    tags: string[];
  };
  onComplete: (id: string) => void;
}

export default function TaskCard({ task, onComplete }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const handleComplete = () => {
    setShowConfetti(true);
    onComplete(task.id);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <>
      {showConfetti && (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
          <confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
          />
        </div>
      )}
      
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <motion.h3
              layout="position"
              className="text-xl font-semibold text-gray-900"
            >
              {task.name}
            </motion.h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>

          <motion.div
            layout="position"
            className="mt-4 space-y-4"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-600">
                Due {format(task.dueDate, 'MMM dd, yyyy')}
              </span>
            </div>

            <motion.div
              layout="position"
              className="relative pt-1"
            >
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                    Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-teal-600">
                    {task.progress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${task.progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
                />
              </div>
            </motion.div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-gray-600"
                >
                  <p className="text-sm">{task.description}</p>
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
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between items-center mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-teal-600 hover:text-teal-700"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors"
                onClick={handleComplete}
              >
                Complete Task
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
} 