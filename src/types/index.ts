export interface Task {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  progress: number;
  tags: string[];
  completed: boolean;
}

export interface TaskStats {
  completed: number;
  pending: number;
  overdue: number;
  upcoming: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

export interface CategoryDistribution {
  [key: string]: number;
}

export type SortOption = 'dueDate' | 'priority' | 'progress' | 'name';
export type FilterOption = 'all' | 'completed' | 'active' | 'high' | 'medium' | 'low';
export type Priority = 'low' | 'medium' | 'high'; 