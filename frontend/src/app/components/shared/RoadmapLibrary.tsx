"use client"
import React, { useState } from 'react';
import { 
  CheckCircle2Icon, 
  CheckIcon, 
  CircleIcon, 
  PlayIcon, 
  UsersIcon, 
  ClipboardListIcon 
} from 'lucide-react';

export default function RoadmapLibrary() {
  const [roadmap, setRoadmap] = useState({
    title: 'Web Development Roadmap',
    steps: [
      {
        id: 1,
        title: 'HTML & CSS Fundamentals',
        description: 'Learn the basic structure and styling of web pages',
        isCompleted: false,
        collaborators: [
          { name: 'John Doe', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=John' },
          { name: 'Jane Smith', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Jane' }
        ],
        collaborationCount: 25,
        quizAvailable: true
      },
      {
        id: 2,
        title: 'JavaScript Basics',
        description: 'Understand core JavaScript concepts and programming logic',
        isCompleted: false,
        collaborators: [
          { name: 'Mike Johnson', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Mike' },
          { name: 'Emily Brown', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Emily' }
        ],
        collaborationCount: 30,
        quizAvailable: true
      },
      {
        id: 3,
        title: 'React Fundamentals',
        description: 'Learn component-based development with React',
        isCompleted: false,
        collaborators: [
          { name: 'Sarah Lee', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Sarah' },
          { name: 'Tom Wilson', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Tom' }
        ],
        collaborationCount: 20,
        quizAvailable: true
      }
    ]
  });

  const toggleStepCompletion = (stepId:any) => {
    setRoadmap(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId 
          ? { ...step, isCompleted: !step.isCompleted } 
          : step
      )
    }));
  };

  const startQuiz = (stepId:any) => {
    // Placeholder for quiz navigation
    alert(`Starting quiz for step ${stepId}`);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center mb-8">
        <ClipboardListIcon className="w-8 h-8 text-blue-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">{roadmap.title}</h1>
      </div>

      <div className="space-y-8 relative">
        {roadmap.steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Box */}
            <div className="w-full bg-white border-2 rounded-xl shadow-md p-6 relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    {step.isCompleted ? (
                      <CheckCircle2Icon className="mr-2 text-green-500" />
                    ) : (
                      <CircleIcon className="mr-2 text-gray-300" />
                    )}
                    Step {index + 1}: {step.title}
                  </h2>
                  <p className="text-gray-600 mt-2">{step.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {/* Completion Toggle */}
                  <button 
                    onClick={() => toggleStepCompletion(step.id)}
                    className={`p-2 rounded-full ${
                      step.isCompleted 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    <CheckIcon className="w-5 h-5" />
                  </button>

                  {/* Quiz Button */}
                  {step.quizAvailable && (
                    <button 
                      onClick={() => startQuiz(step.id)}
                      className="bg-blue-50 text-blue-600 p-2 rounded-full hover:bg-blue-100"
                    >
                      <PlayIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Collaboration Section */}
              <div className="flex items-center mt-4 border-t pt-4">
                <UsersIcon className="w-5 h-5 mr-2 text-gray-500" />
                <div className="flex -space-x-2 mr-3">
                  {step.collaborators.map((collab, collabIndex) => (
                    <img 
                      key={collabIndex}
                      src={collab.avatar} 
                      alt={collab.name}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {step.collaborationCount} people completed this step
                </span>
              </div>
            </div>

            {/* Connecting Arrow (except for last step) */}
            {index < roadmap.steps.length - 1 && (
              <div className="mx-4 flex flex-col items-center">
                <div className="w-0.5 h-12 bg-blue-300"></div>
                <div className="rotate-45 w-3 h-3 bg-blue-300 -mt-1.5"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Overall Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full" 
            style={{
              width: `${
                (roadmap.steps.filter(step => step.isCompleted).length / roadmap.steps.length) * 100
              }%`
            }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>
            {roadmap.steps.filter(step => step.isCompleted).length} / {roadmap.steps.length} Steps
          </span>
          <span>
            {Math.round(
              (roadmap.steps.filter(step => step.isCompleted).length / roadmap.steps.length) * 100
            )}% Complete
          </span>
        </div>
      </div>
    </div>
  );
}
