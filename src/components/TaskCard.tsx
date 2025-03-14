import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import Confetti from 'react-confetti';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
}

const priorityColors = {
  low: '#4CAF50',
  medium: '#FFA726',
  high: '#EF5350'
} as const;

export default function TaskCard({ task, onComplete }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleComplete = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      onComplete(task.id);
    }, 2000);
  }, [task.id, onComplete]);

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
      <motion.div
        layout
        className="task-card"
        style={{
          backgroundColor: 'var(--secondary-color)',
          borderRadius: 'var(--border-radius)',
          padding: 'var(--spacing-md)',
          margin: 'var(--spacing-sm) 0',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(118, 171, 174, 0.2)'
        }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 'var(--spacing-sm)',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ flex: 1, minWidth: '200px' }}>
            <motion.h3
              layout="position"
              style={{
                margin: 0,
                color: 'var(--text-color)',
                fontSize: '1.1rem',
                fontWeight: 600,
                marginBottom: 'var(--spacing-xs)'
              }}
            >
              {task.name}
            </motion.h3>
            <motion.div
              layout="position"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                flexWrap: 'wrap'
              }}
            >
              <span
                style={{
                  backgroundColor: priorityColors[task.priority],
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem'
                }}
              >
                {task.priority}
              </span>
              <span
                style={{
                  color: 'var(--text-color)',
                  opacity: 0.8,
                  fontSize: '0.9rem'
                }}
              >
                Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </span>
            </motion.div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-sm)',
              flexWrap: 'wrap'
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="button"
              style={{
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                fontSize: '0.9rem',
                minWidth: '80px'
              }}
            >
              {isExpanded ? 'Less' : 'More'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleComplete}
              className="button"
              style={{
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                fontSize: '0.9rem',
                minWidth: '80px',
                backgroundColor: '#4CAF50'
              }}
            >
              Complete
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <div
                style={{
                  marginTop: 'var(--spacing-md)',
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'rgba(118, 171, 174, 0.1)',
                  borderRadius: 'var(--border-radius)',
                }}
              >
                <p style={{ margin: 0, color: 'var(--text-color)', fontSize: '0.95rem' }}>
                  {task.description}
                </p>
                <div
                  style={{
                    marginTop: 'var(--spacing-md)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'var(--spacing-xs)'
                  }}
                >
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        backgroundColor: 'var(--primary-color)',
                        color: 'var(--text-color)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 'var(--spacing-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)'
                  }}
                >
                  <span style={{ color: 'var(--text-color)', fontSize: '0.9rem' }}>
                    Progress:
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: '8px',
                      backgroundColor: 'rgba(118, 171, 174, 0.2)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${task.progress}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      style={{
                        height: '100%',
                        backgroundColor: 'var(--primary-color)',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                  <span style={{ color: 'var(--text-color)', fontSize: '0.9rem' }}>
                    {task.progress}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
} 