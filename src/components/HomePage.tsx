import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    title: 'Calendar View',
    description: 'View and manage your tasks in a calendar layout',
    icon: '📅',
    path: '/calendar',
    color: '#76ABAE'
  },
  {
    title: 'Task List',
    description: 'View all tasks in a sortable and filterable list',
    icon: '📝',
    path: '/tasks',
    color: '#4CAF50'
  },
  {
    title: 'Statistics',
    description: 'View detailed statistics and progress charts',
    icon: '📊',
    path: '/stats',
    color: '#FFA726'
  },
  {
    title: 'Categories',
    description: 'Manage task categories and tags',
    icon: '🏷️',
    path: '/categories',
    color: '#EF5350'
  },
  {
    title: 'Quick Add',
    description: 'Quickly add new tasks',
    icon: '➕',
    path: '/tasks/new',
    color: '#9C27B0'
  },
  {
    title: 'Settings',
    description: 'Customize your experience',
    icon: '⚙️',
    path: '/settings',
    color: '#607D8B'
  }
] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: 'center',
          marginBottom: 'var(--spacing-xl)'
        }}
      >
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          color: 'var(--text-color)',
          marginBottom: 'var(--spacing-md)'
        }}>
          Welcome to TaskMaster
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'var(--text-color)',
          opacity: 0.8,
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Manage your tasks efficiently with our comprehensive task management system
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--spacing-md)',
          maxWidth: 'var(--container-width)',
          margin: '0 auto'
        }}
      >
        {features.map((feature) => (
          <motion.div
            key={feature.path}
            variants={item}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(feature.path)}
            style={{
              backgroundColor: 'var(--secondary-color)',
              borderRadius: 'var(--border-radius)',
              padding: 'var(--spacing-lg)',
              cursor: 'pointer',
              border: '1px solid rgba(118, 171, 174, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                backgroundColor: feature.color,
                borderTopLeftRadius: 'var(--border-radius)',
                borderBottomLeftRadius: 'var(--border-radius)'
              }}
            />
            <div style={{
              fontSize: '2rem',
              marginBottom: 'var(--spacing-sm)',
              filter: 'grayscale(0.2)'
            }}>
              {feature.icon}
            </div>
            <h2 style={{
              fontSize: '1.2rem',
              color: 'var(--text-color)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              {feature.title}
            </h2>
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-color)',
              opacity: 0.8
            }}>
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          marginTop: 'var(--spacing-xl)',
          textAlign: 'center',
          color: 'var(--text-color)',
          opacity: 0.6,
          fontSize: '0.9rem'
        }}
      >
        <p>Press any card to navigate to the respective feature</p>
      </motion.div>

      <style>
        {`
          @media (max-width: 768px) {
            .home-grid {
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            }
          }

          @media (max-width: 480px) {
            .home-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            * {
              animation: none !important;
              transition: none !important;
            }
          }
        `}
      </style>
    </div>
  );
} 