import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface StatsProps {
  taskData: {
    completed: number;
    pending: number;
    overdue: number;
    upcoming: number;
  };
  weeklyProgress: number[];
  categoryDistribution: {
    [key: string]: number;
  };
}

export default function StatsDashboard({ taskData, weeklyProgress, categoryDistribution }: StatsProps) {
  const [activeChart, setActiveChart] = useState('progress');

  const progressChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: weeklyProgress,
        fill: true,
        borderColor: '#76ABAE',
        backgroundColor: 'rgba(118, 171, 174, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const taskStatusData = {
    labels: ['Completed', 'Pending', 'Overdue', 'Upcoming'],
    datasets: [
      {
        data: [taskData.completed, taskData.pending, taskData.overdue, taskData.upcoming],
        backgroundColor: [
          '#4CAF50',
          '#FFC107',
          '#F44336',
          '#2196F3',
        ],
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(categoryDistribution),
    datasets: [
      {
        label: 'Tasks per Category',
        data: Object.values(categoryDistribution),
        backgroundColor: 'rgba(118, 171, 174, 0.8)',
        borderColor: 'rgba(118, 171, 174, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/* Stats Overview */}
      <motion.div
        layout
        className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <StatsCard
          title="Completed"
          value={taskData.completed}
          color="bg-green-100 text-green-800"
          icon="✓"
        />
        <StatsCard
          title="Pending"
          value={taskData.pending}
          color="bg-yellow-100 text-yellow-800"
          icon="⏳"
        />
        <StatsCard
          title="Overdue"
          value={taskData.overdue}
          color="bg-red-100 text-red-800"
          icon="⚠"
        />
        <StatsCard
          title="Upcoming"
          value={taskData.upcoming}
          color="bg-blue-100 text-blue-800"
          icon="→"
        />
      </motion.div>

      {/* Chart Navigation */}
      <div className="col-span-full flex justify-center space-x-4">
        <ChartButton
          active={activeChart === 'progress'}
          onClick={() => setActiveChart('progress')}
        >
          Weekly Progress
        </ChartButton>
        <ChartButton
          active={activeChart === 'status'}
          onClick={() => setActiveChart('status')}
        >
          Task Status
        </ChartButton>
        <ChartButton
          active={activeChart === 'category'}
          onClick={() => setActiveChart('category')}
        >
          Categories
        </ChartButton>
      </div>

      {/* Charts */}
      <div className="col-span-full h-[400px]">
        <AnimatedChartContainer show={activeChart === 'progress'}>
          <Line data={progressChartData} options={chartOptions} />
        </AnimatedChartContainer>
        
        <AnimatedChartContainer show={activeChart === 'status'}>
          <Doughnut data={taskStatusData} options={chartOptions} />
        </AnimatedChartContainer>
        
        <AnimatedChartContainer show={activeChart === 'category'}>
          <Bar data={categoryData} options={chartOptions} />
        </AnimatedChartContainer>
      </div>
    </motion.div>
  );
}

function StatsCard({ title, value, color, icon }: { title: string; value: number; color: string; icon: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`${color} rounded-lg p-4 text-center`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm">{title}</div>
    </motion.div>
  );
}

function ChartButton({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-teal-500 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

function AnimatedChartContainer({ children, show }: { children: React.ReactNode; show: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{
        opacity: show ? 1 : 0,
        scale: show ? 1 : 0.95,
        height: show ? '100%' : 0,
      }}
      style={{ display: show ? 'block' : 'none' }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
} 