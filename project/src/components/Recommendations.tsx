import React, { useEffect, useState } from 'react';

import {
  Car,
  Utensils,
  Zap,
  Trash2,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import axios from 'axios';

type Recommendation = {
  category: string;
  icon: any;
  color: string;
  bgColor: string;
  tips: string[];
};

type Action = {
  title: string;
  impact: string;
  effort: string;
  co2Savings: string;
  description: string;
};

const fallbackData = {
  priorityActions: [
    {
      title: 'Switch to LED Bulbs',
      impact: 'High',
      effort: 'Low',
      co2Savings: '0.5 kg CO2/day',
      description:
        'Replace incandescent bulbs with LED alternatives to reduce energy consumption by 75%.',
    },
    {
      title: 'Reduce Meat Consumption',
      impact: 'High',
      effort: 'Medium',
      co2Savings: '2.3 kg CO2/day',
      description:
        'Try Meatless Mondays or replace one meat meal per day with a plant-based alternative.',
    },
    {
      title: 'Use Public Transport',
      impact: 'High',
      effort: 'Medium',
      co2Savings: '4.6 kg CO2/day',
      description:
        'Replace car trips with public transport, walking, or cycling for short distances.',
    },
  ],
  recommendations: [
    {
      category: 'Transportation',
      icon: Car,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      tips: [
        'Walk or bike for trips under 2 km',
        'Use public transportation for longer distances',
        'Carpool or rideshare when driving is necessary',
        'Consider an electric or hybrid vehicle',
        'Work from home when possible',
      ],
    },
    {
      category: 'Food & Diet',
      icon: Utensils,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      tips: [
        'Eat more plant-based meals',
        'Reduce red meat consumption',
        'Buy local and seasonal produce',
        'Plan meals to reduce food waste',
        'Grow your own herbs and vegetables',
      ],
    },
    {
      category: 'Energy Usage',
      icon: Zap,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      tips: [
        'Switch to LED light bulbs',
        'Unplug devices when not in use',
        'Use programmable thermostats',
        'Insulate your home properly',
        'Consider renewable energy sources',
      ],
    },
    {
      category: 'Waste Reduction',
      icon: Trash2,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      tips: [
        'Use reusable bags and containers',
        'Recycle properly and consistently',
        'Compost organic waste',
        'Buy products with minimal packaging',
        'Repair items instead of replacing them',
      ],
    },
  ],
};

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [priorityActions, setPriorityActions] = useState<Action[]>([]);
  const userId= localStorage.getItem('user_id');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/data/recommendations/${userId}`);
        setRecommendations(res.data.recommendations || []);
        setPriorityActions(res.data.priority_actions || []);
      } catch (error) {
        // fallback to mock data
        setRecommendations(fallbackData.recommendations);
        setPriorityActions(fallbackData.priorityActions);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div>
      {/* You can render the data below */}
      <h2 className="text-xl font-bold mb-4">Priority Actions</h2>
      <ul className="space-y-4">
        {priorityActions.map((action, idx) => (
          <li
            key={idx}
            className="border border-gray-300 rounded-2xl p-4 shadow-md bg-white"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {action.title}
            </h3>
            <p className="text-gray-600 mb-2">{action.description}</p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Impact:</span> {action.impact} |{" "}
              <span className="font-semibold">Effort:</span> {action.effort} |{" "}
              <span className="font-semibold">CO2 Savings:</span> {action.co2Savings}
            </p>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-bold mt-8 mb-4">Recommendations by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec, idx) => (
          <div key={idx} className={`p-4 rounded-lg shadow ${rec.bgColor}`}>
            <div className="flex items-center gap-2 mb-2">
              {/* <rec.icon className={`w-6 h-6 ${rec.color}`} /> */}
              <h3 className="text-lg font-semibold">{rec.category}</h3>
            </div>
            <ul className="list-disc ml-5">
              {rec.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
