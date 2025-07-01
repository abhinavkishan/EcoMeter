export interface User {
  id: string;
  email: string;
  name: string;
  isFirstLogin: boolean;
  setupComplete: boolean;
  location: string;
  householdSize: number;
  baselineFootprint: number;
  totalPoints: number;
  joinedDate: string;
}

export interface DailyData {
  id: string;
  userId: string;
  date: string;
  travel: number;
  food: number;
  waste: number;
  electricity: number;
  totalFootprint: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  points: number;
  category: 'transport' | 'food' | 'waste' | 'electricity';
  completed: boolean;
  dateCompleted?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

export interface ChartData {
  date: string;
  travel: number;
  food: number;
  waste: number;
  electricity: number;
  total: number;
}