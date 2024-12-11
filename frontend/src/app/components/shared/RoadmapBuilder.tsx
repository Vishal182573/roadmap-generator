"use client"
import React, { useState } from 'react';
import { 
  SparklesIcon, 
  SearchIcon, 
  RefreshCcwIcon 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define type for Roadmap Step
interface RoadmapStep {
  title: string;
  description: string;
}

// Define type for Roadmap
interface Roadmap {
  id: number;
  title: string;
  description: string;
  steps: RoadmapStep[];
}

export default function AIRoadmapBuilder() {
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedRoadmaps, setSuggestedRoadmaps] = useState<Roadmap[]>([]);
  const router = useRouter();

  // Mock AI generation function
  const generateRoadmap = () => {
    // Simulating AI generation process
    setIsGenerating(true);
    
    // Simulated AI roadmap suggestions
    const aiSuggestions: Roadmap[] = [
      {
        id: 1,
        title: `${query} Learning Path`,
        description: `Comprehensive roadmap for mastering ${query}`,
        steps: [
          { 
            title: 'Foundations', 
            description: 'Learn basic concepts and core principles' 
          },
          { 
            title: 'Intermediate Skills', 
            description: 'Develop advanced techniques and practical applications' 
          },
          { 
            title: 'Advanced Mastery', 
            description: 'Explore complex strategies and specialized knowledge' 
          }
        ]
      }
    ];

    // Simulate API call delay
    setTimeout(() => {
      router.push("/roadmap"); 
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <SparklesIcon className="w-8 h-8 text-purple-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">AI Roadmap Generator</h2>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="What skill do you want to learn? (e.g., Web Development, Machine Learning)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 pl-10 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-300 transition-all text-black"
        />
      </div>

      <button
        onClick={generateRoadmap}
        disabled={!query || isGenerating}
        className={`w-full flex items-center justify-center p-3 rounded-lg transition-all ${
          query && !isGenerating 
            ? 'bg-purple-500 text-white hover:bg-purple-600' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isGenerating ? (
          <div className="flex items-center">
            <RefreshCcwIcon className="mr-2 animate-spin" />
            Generating Roadmap...
          </div>
        ) : (
          <>
            <SparklesIcon className="mr-2" />
            Generate AI Roadmap
          </>
        )}
      </button>

      {suggestedRoadmaps.length > 0 && (
        <div className="mt-6 animate-fade-in">
          {suggestedRoadmaps.map((roadmap) => (
            <div 
              key={roadmap.id} 
              className="bg-purple-50 p-4 rounded-lg mt-4 border border-purple-100"
            >
              <h3 className="text-xl font-bold text-purple-800 mb-4">
                {roadmap.title}
              </h3>
              <p className="text-gray-600 mb-4">{roadmap.description}</p>
              
              <div className="space-y-4">
                {roadmap.steps.map((step, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-3 rounded-lg shadow-sm border"
                  >
                    <h4 className="font-semibold text-purple-700">
                      Step {index + 1}: {step.title}
                    </h4>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}