import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface StatsProps {
  taskData: {
    completed: number;
    pending: number;
    overdue: number;
    upcoming: number;
  };
  weeklyProgress: number[];
  categoryDistribution: Record<string, number>;
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#EEEEEE',
        font: {
          size: 12
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(238, 238, 238, 0.1)'
      },
      ticks: {
        color: '#EEEEEE'
      }
    },
    x: {
      grid: {
        color: 'rgba(238, 238, 238, 0.1)'
      },
      ticks: {
        color: '#EEEEEE'
      }
    }
  }
};

function StatsCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      style={{
        backgroundColor: 'var(--secondary-color)',
        borderRadius: 'var(--border-radius)',
        padding: 'var(--spacing-md)',
        flex: '1 1 200px',
        minWidth: '200px',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(118, 171, 174, 0.2)'
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color
        }}
      >
        {icon}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-color)', opacity: 0.8 }}>
          {title}
        </h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-color)' }}>
          {value}
        </p>
      </div>
    </motion.div>
  );
}

function ChartButton({ isActive, onClick, children }: { isActive: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        padding: 'var(--spacing-sm) var(--spacing-md)',
        backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
        border: '1px solid var(--primary-color)',
        borderRadius: 'var(--border-radius)',
        color: 'var(--text-color)',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'background-color var(--transition-speed)'
      }}
    >
      {children}
    </motion.button>
  );
}

function AnimatedChartContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      style={{
        backgroundColor: 'var(--secondary-color)',
        borderRadius: 'var(--border-radius)',
        padding: 'var(--spacing-md)',
        height: '300px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(118, 171, 174, 0.2)'
      }}
    >
      {children}
    </motion.div>
  );
}

export default function StatsDashboard({ taskData, weeklyProgress, categoryDistribution }: StatsProps) {
  const [activeChart, setActiveChart] = React.useState<'progress' | 'status' | 'category'>('progress');

  const progressChartData = useMemo(() => ({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Tasks Completed',
      data: weeklyProgress,
      borderColor: '#76ABAE',
      backgroundColor: 'rgba(118, 171, 174, 0.2)',
      tension: 0.4
    }]
  }), [weeklyProgress]);

  const taskStatusData = useMemo(() => ({
    labels: ['Completed', 'Pending', 'Overdue', 'Upcoming'],
    datasets: [{
      data: [taskData.completed, taskData.pending, taskData.overdue, taskData.upcoming],
      backgroundColor: ['#4CAF50', '#FFA726', '#EF5350', '#76ABAE'],
      borderWidth: 0
    }]
  }), [taskData]);

  const categoryData = useMemo(() => ({
    labels: Object.keys(categoryDistribution),
    datasets: [{
      label: 'Tasks per Category',
      data: Object.values(categoryDistribution),
      backgroundColor: 'rgba(118, 171, 174, 0.6)',
      borderColor: '#76ABAE',
      borderWidth: 1
    }]
  }), [categoryDistribution]);

  return (
    <div style={{ width: '100%', maxWidth: 'var(--container-width)', margin: '0 auto' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-lg)'
        }}
      >
        <StatsCard
          title="Completed Tasks"
          value={taskData.completed}
          icon={<span>✓</span>}
          color="#4CAF50"
        />
        <StatsCard
          title="Pending Tasks"
          value={taskData.pending}
          icon={<span>⏳</span>}
          color="#FFA726"
        />
        <StatsCard
          title="Overdue Tasks"
          value={taskData.overdue}
          icon={<span>⚠️</span>}
          color="#EF5350"
        />
        <StatsCard
          title="Upcoming Tasks"
          value={taskData.upcoming}
          icon={<span>📅</span>}
          color="#76ABAE"
        />
      </div>

      <div
        style={{
          display: 'flex',
          gap: 'var(--spacing-sm)',
          marginBottom: 'var(--spacing-md)',
          flexWrap: 'wrap'
        }}
      >
        <ChartButton
          isActive={activeChart === 'progress'}
          onClick={() => setActiveChart('progress')}
        >
          Weekly Progress
        </ChartButton>
        <ChartButton
          isActive={activeChart === 'status'}
          onClick={() => setActiveChart('status')}
        >
          Task Status
        </ChartButton>
        <ChartButton
          isActive={activeChart === 'category'}
          onClick={() => setActiveChart('category')}
        >
          Categories
        </ChartButton>
      </div>

      <AnimatePresence mode="wait">
        {activeChart === 'progress' && (
          <AnimatedChartContainer key="progress">
            <Line data={progressChartData} options={chartOptions} />
          </AnimatedChartContainer>
        )}
        {activeChart === 'status' && (
          <AnimatedChartContainer key="status">
            <Doughnut
              data={taskStatusData}
              options={{
                ...chartOptions,
                cutout: '60%'
              }}
            />
          </AnimatedChartContainer>
        )}
        {activeChart === 'category' && (
          <AnimatedChartContainer key="category">
            <Bar data={categoryData} options={chartOptions} />
          </AnimatedChartContainer>
        )}
      </AnimatePresence>

      <style>
        {`
          @media (max-width: 768px) {
            .stats-grid {
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            }
          }

          @media (max-width: 480px) {
            .stats-grid {
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