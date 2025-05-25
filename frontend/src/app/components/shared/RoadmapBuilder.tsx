"use client"
import React, { useState } from 'react';
import { 
  SparklesIcon, 
  SearchIcon, 
  RefreshCcwIcon,
  BookOpenIcon,
  ClockIcon,
  TrendingUpIcon,
  TagIcon,
  ArrowRightIcon,
  BrainIcon,
  TargetIcon,
  ZapIcon
} from 'lucide-react';

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  estimatedDuration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites: string[];
  resources: {
    type: 'article' | 'video' | 'course' | 'practice';
    title: string;
    url?: string;
    description: string;
  }[];
  skills: string[];
  projects: string[];
  isCompleted: boolean;
  completionCriteria: string[];
}

interface GeneratedRoadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  totalDuration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: RoadmapStep[];
  tags: string[];
  createdAt: string;
}

interface AIRoadmapBuilderProps {
  onRoadmapGenerated?: (roadmap: GeneratedRoadmap) => void;
}

export default function AIRoadmapBuilder({ onRoadmapGenerated }: AIRoadmapBuilderProps) {
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState<GeneratedRoadmap | null>(null);
  const [error, setError] = useState<string | null>(null);

  const popularTopics = [
    { title: 'Web Development', icon: '🌐', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { title: 'Machine Learning', icon: '🤖', color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { title: 'Mobile App Development', icon: '📱', color: 'bg-green-50 text-green-600 border-green-200' },
    { title: 'Data Science', icon: '📊', color: 'bg-orange-50 text-orange-600 border-orange-200' },
    { title: 'UI/UX Design', icon: '🎨', color: 'bg-pink-50 text-pink-600 border-pink-200' },
    { title: 'DevOps', icon: '⚙️', color: 'bg-gray-50 text-gray-600 border-gray-200' }
  ];

  const generateRoadmap = async () => {
    if (!query.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedRoadmap(null);

    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate roadmap');
      }

      setGeneratedRoadmap(data.roadmap);
      if (onRoadmapGenerated) {
        onRoadmapGenerated(data.roadmap);
      }

      if (data.fallback) {
        setError('Using fallback roadmap. Please check your Gemini API configuration.');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate roadmap');
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article': return '📖';
      case 'video': return '🎥';
      case 'course': return '🎓';
      case 'practice': return '💻';
      default: return '📚';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <BrainIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Roadmap Generator
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Transform your learning goals into structured, actionable roadmaps with AI-powered guidance
        </p>
      </div>

      {/* Main Generation Card */}
      <div className="bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">
        {/* Search Section */}
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="What skill would you like to master? (e.g., React Development, Python Programming)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && generateRoadmap()}
              className="w-full p-4 pl-12 pr-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 text-black placeholder-gray-500"
            />
          </div>

          {/* Popular Topics */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-500 flex items-center">
              <ZapIcon className="w-4 h-4 mr-2" />
              Popular Learning Paths
            </p>
            <div className="flex flex-wrap gap-3">
              {popularTopics.map((topic) => (
                <button
                  key={topic.title}
                  onClick={() => setQuery(topic.title)}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all hover:scale-105 ${topic.color}`}
                >
                  <span className="mr-2">{topic.icon}</span>
                  {topic.title}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateRoadmap}
            disabled={!query.trim() || isGenerating}
            className={`w-full flex items-center justify-center p-4 rounded-2xl font-semibold text-lg transition-all duration-200 ${
              query.trim() && !isGenerating 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-[1.02] shadow-lg hover:shadow-xl' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center space-x-3">
                <RefreshCcwIcon className="w-6 h-6 animate-spin" />
                <span>Generating Your Personalized Roadmap...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <SparklesIcon className="w-6 h-6" />
                <span>Generate AI-Powered Roadmap</span>
                <ArrowRightIcon className="w-5 h-5" />
              </div>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Generated Roadmap Display */}
      {generatedRoadmap && (
        <div className="space-y-6 animate-fade-in">
          {/* Roadmap Header */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-3xl border border-purple-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-800">{generatedRoadmap.title}</h2>
                <p className="text-lg text-gray-600">{generatedRoadmap.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm">
                  <ClockIcon className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-700">{generatedRoadmap.totalDuration}</span>
                </div>
                <div className={`px-4 py-2 rounded-xl font-medium ${getDifficultyColor(generatedRoadmap.difficulty)}`}>
                  <TrendingUpIcon className="w-4 h-4 inline mr-2" />
                  {generatedRoadmap.difficulty}
                </div>
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm">
                  <BookOpenIcon className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-gray-700">{generatedRoadmap.steps.length} Steps</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {generatedRoadmap.tags.length > 0 && (
              <div className="mt-4 flex items-center space-x-2">
                <TagIcon className="w-4 h-4 text-gray-500" />
                <div className="flex flex-wrap gap-2">
                  {generatedRoadmap.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-white text-gray-600 text-sm rounded-lg shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Roadmap Steps */}
          <div className="space-y-6">
            {generatedRoadmap.steps.map((step, index) => (
              <div key={step.id} className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-grow space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getDifficultyColor(step.difficulty)}`}>
                          {step.difficulty}
                        </span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                          {step.estimatedDuration}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed">{step.description}</p>

                    {/* Skills & Projects */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {step.skills.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-700 flex items-center">
                            <TargetIcon className="w-4 h-4 mr-2 text-green-500" />
                            Skills You'll Gain
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {step.skills.map((skill, idx) => (
                              <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-lg">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {step.projects.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-700 flex items-center">
                            <BookOpenIcon className="w-4 h-4 mr-2 text-blue-500" />
                            Practice Projects
                          </h4>
                          <ul className="space-y-1">
                            {step.projects.map((project, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-center">
                                <ArrowRightIcon className="w-3 h-3 mr-2 text-gray-400" />
                                {project}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Resources */}
                    {step.resources.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700">Recommended Resources</h4>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {step.resources.map((resource, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-lg border">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-lg">{getResourceIcon(resource.type)}</span>
                                <span className="font-medium text-gray-800 capitalize">{resource.type}</span>
                              </div>
                              <h5 className="font-medium text-gray-700">{resource.title}</h5>
                              <p className="text-sm text-gray-600">{resource.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Completion Criteria */}
                    {step.completionCriteria.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700">How to Know You've Mastered This Step</h4>
                        <ul className="space-y-1">
                          {step.completionCriteria.map((criteria, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center">
                              <ArrowRightIcon className="w-3 h-3 mr-2 text-gray-400" />
                              {criteria}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-[1.02]">
              Save Roadmap
            </button>
            <button className="flex-1 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:bg-gray-50 transition-all">
              Share Roadmap
            </button>
            <button 
              onClick={() => {
                setGeneratedRoadmap(null);
                setQuery('');
              }}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Generate New
            </button>
          </div>
        </div>
      )}
    </div>
  );
}