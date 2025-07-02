import React, { createContext, useContext, useState, useEffect } from 'react';
import { DailyData, Goal, Badge, ChartData } from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
  dailyData: DailyData[];
  goals: Goal[];
  badges: Badge[];
  addDailyData: (data: Omit<DailyData, 'id' | 'userId' | 'totalFootprint'>) => void;
  completeGoal: (goalId: string) => void;
  getChartData: (filter: 'daily' | 'weekly' | 'monthly') => ChartData[];
  getDailyFact: () => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const carbonFacts = [
  "The average person's carbon footprint is about 16 tons of CO2 per year.",
  "Transportation accounts for about 29% of greenhouse gas emissions.",
  "A single tree can absorb about 48 pounds of CO2 per year.",
  "Eating less meat can reduce your carbon footprint by up to 35%.",
  "LED bulbs use 75% less energy than traditional incandescent bulbs.",
  "Carpooling can reduce your carbon emissions by up to 45%.",
  "Recycling one aluminum can saves enough energy to power a TV for 3 hours.",
  "Walking or biking instead of driving can save 1 pound of CO2 per mile.",
];

const initialGoals: Goal[] = [
  {
    id: '1',
    title: 'Use Public Transport',
    description: 'Use public transport for 5 days this week',
    target: 5,
    points: 50,
    category: 'transport',
    completed: false,
  },
  {
    id: '2',
    title: 'Reduce Electricity Usage',
    description: 'Reduce electricity use by 10% this week',
    target: 10,
    points: 75,
    category: 'electricity',
    completed: false,
  },
  {
    id: '3',
    title: 'Minimize Food Waste',
    description: 'Reduce food waste by 20% this week',
    target: 20,
    points: 60,
    category: 'food',
    completed: false,
  },
  {
    id: '4',
    title: 'Increase Recycling',
    description: 'Recycle 90% of your waste this week',
    target: 90,
    points: 40,
    category: 'waste',
    completed: false,
  },
];

const initialBadges: Badge[] = [
  {
    id: '1',
    name: 'Eco Warrior',
    description: 'Complete 5 goals',
    icon: '🌱',
    earned: false,
  },
  {
    id: '2',
    name: 'Green Commuter',
    description: 'Use public transport for 30 days',
    icon: '🚌',
    earned: false,
  },
  {
    id: '3',
    name: 'Energy Saver',
    description: 'Reduce electricity by 50%',
    icon: '⚡',
    earned: false,
  },
  {
    id: '4',
    name: 'Waste Reducer',
    description: 'Minimize waste for 14 days',
    icon: '♻️',
    earned: false,
  },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [badges, setBadges] = useState<Badge[]>(initialBadges);

  useEffect(() => {
    if (user) {
      const savedData = localStorage.getItem(`ecometer_data_${user.id}`);
      if (savedData) {
        const data = JSON.parse(savedData);
        setDailyData(data.dailyData || []);
        setGoals(data.goals || initialGoals);
        setBadges(data.badges || initialBadges);
      }
    }
  }, [user]);

  const saveData = (data: any) => {
    if (user) {
      localStorage.setItem(`ecometer_data_${user.id}`, JSON.stringify(data));
    }
  };

  const addDailyData = (data: Omit<DailyData, 'id' | 'userId' | 'totalFootprint'>) => {
    if (!user) return;

    const totalFootprint = data.travel + data.food + data.waste + data.electricity;
    const newData: DailyData = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      totalFootprint,
      ...data,
    };

    const updatedDailyData = [...dailyData, newData];
    setDailyData(updatedDailyData);
    saveData({ dailyData: updatedDailyData, goals, badges });
  };

  const completeGoal = (goalId: string) => {
    const updatedGoals = goals.map(goal  =>
      goal.id === goalId
        ? { ...goal, completed: true, dateCompleted: new Date().toISOString() }
        : goal
    );
    setGoals(updatedGoals);
    saveData({ dailyData, goals: updatedGoals, badges });
  };

  const getChartData = (filter: 'daily' | 'weekly' | 'monthly'): ChartData[] => {
    if (!dailyData.length) return [];

    const now = new Date();
    let filteredData = dailyData;

    switch (filter) {
      case 'daily':
        filteredData = dailyData.slice(-7);
        break;
      case 'weekly':
        filteredData = dailyData.slice(-28);
        break;
      case 'monthly':
        filteredData = dailyData.slice(-365);
        break;
    }

    return filteredData.map(data => ({
      date: new Date(data.date).toLocaleDateString(),
      travel: data.travel,
      food: data.food,
      waste: data.waste,
      electricity: data.electricity,
      total: data.totalFootprint,
    }));
  };

  const getDailyFact = (): string => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return carbonFacts[dayOfYear % carbonFacts.length];
  };

  return (
    <DataContext.Provider value={{
      dailyData,
      goals,
      badges,
      addDailyData,
      completeGoal,
      getChartData,
      getDailyFact,
    }}>
      {children}
    </DataContext.Provider>
  );
};