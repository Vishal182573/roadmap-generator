import React from 'react';
import {
  ChartBarIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  GroupIcon,
  TrendingUpIcon,
  UsersIcon
} from 'lucide-react';

export default function RoadmapAnalytics() {
  const analytics = {
    totalRoadmaps: 15,
    completedRoadmaps: 7,
    averageSteps: 6.2,
    collaborators: 22
  };

  const completionPercentage = (analytics.completedRoadmaps / analytics.totalRoadmaps * 100).toFixed(1);

  const analyticsItems = [
    {
      icon: ClipboardListIcon,
      title: 'Total Roadmaps',
      value: analytics.totalRoadmaps,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      icon: CheckCircleIcon,
      title: 'Completed Roadmaps',
      value: `${analytics.completedRoadmaps} (${completionPercentage}%)`,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      icon: TrendingUpIcon,
      title: 'Average Steps',
      value: analytics.averageSteps.toFixed(1),
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      icon: UsersIcon,
      title: 'Total Collaborators',
      value: analytics.collaborators,
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="bg-white shadow-2xl rounded-3xl p-8 border border-gray-100 overflow-hidden relative">
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50 -z-10"></div>
      
      {/* Header */}
      <div className="flex items-center mb-8 space-x-4">
        <ChartBarIcon className="w-10 h-10 text-blue-600 bg-blue-100 rounded-full p-2" />
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Roadmap Analytics
        </h2>
      </div>

      {/* Analytics Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {analyticsItems.map((item, index) => (
          <div 
            key={index} 
            className={`${item.bgColor} p-6 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out border border-transparent hover:border-${item.color}-200 relative overflow-hidden`}
          >
            {/* Subtle Accent Line */}
            <div className={`absolute top-0 left-0 w-1 h-full bg-${item.color}-500`}></div>
            
            <div className="flex items-center space-x-5">
              <item.icon 
                className={`w-12 h-12 ${item.textColor} bg-white rounded-full p-2 shadow-md`} 
              />
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                  {item.title}
                </h3>
                <p className={`text-3xl font-bold ${item.textColor} tracking-tight`}>
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Optional Progress Bar */}
      <div className="mt-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Roadmap Progress</span>
          <span>{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-green-500 h-2.5 rounded-full" 
            style={{width: `${completionPercentage}%`}}
          ></div>
        </div>
      </div>
    </div>
  );
}