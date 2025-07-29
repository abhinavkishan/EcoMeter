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
    <div className='space-y-6'>
       {/* Header */}
       <div className="bg-white rounded-lg shadow-sm p-6">
         <h1 className="text-2xl font-bold text-gray-900 mb-2">Personalized Recommendations</h1>
         <p className="text-gray-600">
          Based on your carbon footprint data, here are tailored suggestions to help you reduce your environmental impact.
         </p>
      </div>
      {/* Priority Actions */}
       <div className="bg-white rounded-lg shadow-sm p-6">
         <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
           <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
           Priority Actions for You
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {priorityActions.map((action, index) => (
             <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
               <div className="flex items-center justify-between mb-2">
                 <h3 className="font-semibold text-gray-900">{action.title}</h3>
                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                   action.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                 }`}>
                   {action.impact} Impact
                 </span>
               </div>
               <p className="text-sm text-gray-600 mb-3">{action.description}</p>
               <div className="flex items-center justify-between">
                 <div className="text-sm">
                   <span className="font-medium text-green-600">Save: {action.co2Savings}</span>
                 </div>
                 <div className="text-sm text-gray-500">
                   Effort: {action.effort}
                 </div>
               </div>
             </div>
           ))}
         </div>
       </div>
     {/* Category-wise Recommendations */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {recommendations.map((category, index) => {
           return (
             <div key={index} className="bg-white rounded-lg shadow-sm p-6">
               <div className={`flex items-center mb-4 p-3 rounded-lg ${category.bgColor}`}>
                 <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
               </div>
               <ul className="space-y-3">
                 {category.tips.map((tip, tipIndex) => (
                   <li key={tipIndex} className="flex items-start">
                     <ArrowRight className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                     <span className="text-gray-700">{tip}</span>
                   </li>
                 ))}
               </ul>
             </div>
           );
         })}
       </div>
       {/* Additional Resources */}
       <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
         <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Resources</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="bg-white rounded-lg p-4">
             <h4 className="font-semibold text-gray-900 mb-2">Carbon Offset Programs</h4>
             <p className="text-sm text-gray-600">
               Consider purchasing carbon offsets for emissions you can't reduce. Look for certified programs
               that support reforestation, renewable energy, or community projects.
             </p>
           </div>
           <div className="bg-white rounded-lg p-4">
             <h4 className="font-semibold text-gray-900 mb-2">Sustainable Living Tips</h4>
             <p className="text-sm text-gray-600">
               Small changes in daily habits can make a big difference. Focus on reducing, reusing, and recycling
               to minimize your environmental footprint.
             </p>
           </div>
         </div>
       </div>
    </div>
  );
};

export default Recommendations;
