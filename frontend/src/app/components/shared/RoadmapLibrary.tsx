"use client"
import React, { useState } from 'react';
import { 
  CheckCircle2Icon, 
  CheckIcon, 
  CircleIcon, 
  PlayIcon, 
  UsersIcon, 
  ClipboardListIcon,
  ClockIcon,
  TrendingUpIcon,
  BookOpenIcon,
  TargetIcon,
  ArrowRightIcon,
  CalendarIcon,
  AwardIcon,
  PlusIcon,
  FilterIcon,
  SearchIcon,
  StarIcon,
  ShareIcon,
  DownloadIcon
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
  completedAt?: string;
  timeSpent?: string;
}

interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  totalDuration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: RoadmapStep[];
  tags: string[];
  createdAt: string;
  lastUpdated: string;
  isFavorite: boolean;
  collaborators?: {
    name: string;
    avatar: string;
  }[];
  collaborationCount?: number;
}

export default function RoadmapLibrary() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([
    {
      id: 'roadmap_1',
      title: 'Full-Stack Web Development Mastery',
      description: 'Complete guide to becoming a professional full-stack web developer',
      category: 'Programming',
      totalDuration: '6-8 months',
      difficulty: 'Intermediate',
      tags: ['React', 'Node.js', 'Database', 'API'],
      createdAt: '2024-01-15',
      lastUpdated: '2024-01-20',
      isFavorite: true,
      collaborators: [
        { name: 'John Doe', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=John' },
        { name: 'Jane Smith', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Jane' }
      ],
      collaborationCount: 125,
      steps: [
        {
          id: 'step_1',
          title: 'HTML & CSS Fundamentals',
          description: 'Master the foundation of web development with semantic HTML and modern CSS including Flexbox, Grid, and responsive design principles.',
          estimatedDuration: '3-4 weeks',
          difficulty: 'Beginner',
          prerequisites: [],
          resources: [
            { 
              type: 'course',
              title: 'HTML & CSS Complete Course',
              description: 'Comprehensive course covering HTML5 and CSS3'
            },
            {
              type: 'practice',
              title: 'CSS Grid & Flexbox Challenges',
              description: 'Interactive coding challenges for layout mastery'
            }
          ],
          skills: ['HTML5', 'CSS3', 'Flexbox', 'CSS Grid', 'Responsive Design'],
          projects: ['Personal Portfolio Website', 'Restaurant Landing Page'],
          isCompleted: true,
          completionCriteria: ['Build responsive layouts', 'Use semantic HTML', 'Master CSS positioning'],
          completedAt: '2024-01-10',
          timeSpent: '25 hours'
        },
        {
          id: 'step_2',
          title: 'JavaScript Fundamentals & DOM Manipulation',
          description: 'Learn JavaScript programming concepts, ES6+ features, and how to interact with the DOM to create dynamic web applications.',
          estimatedDuration: '4-5 weeks',
          difficulty: 'Beginner',
          prerequisites: ['HTML & CSS Fundamentals'],
          resources: [
            {
              type: 'course',
              title: 'Modern JavaScript Course',
              description: 'ES6+ features and modern JavaScript development'
            },
            {
              type: 'practice',
              title: 'JavaScript30 Challenge',
              description: '30 vanilla JavaScript projects in 30 days'
            }
          ],
          skills: ['JavaScript ES6+', 'DOM Manipulation', 'Event Handling', 'Async Programming'],
          projects: ['Interactive Calculator', 'Todo List App', 'Weather App'],
          isCompleted: true,
          completionCriteria: ['Understand closures and scope', 'Handle events efficiently', 'Work with APIs'],
          completedAt: '2024-01-18',
          timeSpent: '32 hours'
        },
        {
          id: 'step_3',
          title: 'React.js Development',
          description: 'Master React fundamentals including components, hooks, state management, and building scalable applications.',
          estimatedDuration: '5-6 weeks',
          difficulty: 'Intermediate',
          prerequisites: ['JavaScript Fundamentals & DOM Manipulation'],
          resources: [
            {
              type: 'course',
              title: 'React Complete Guide',
              description: 'From basics to advanced React patterns'
            },
            {
              type: 'practice',
              title: 'React Projects Collection',
              description: 'Build real-world React applications'
            }
          ],
          skills: ['React Components', 'Hooks', 'State Management', 'React Router'],
          projects: ['E-commerce Frontend', 'Social Media Dashboard', 'Task Management App'],
          isCompleted: false,
          completionCriteria: ['Build complex components', 'Manage application state', 'Implement routing']
        },
        {
          id: 'step_4',
          title: 'Backend Development with Node.js',
          description: 'Learn server-side development with Node.js, Express.js, and database integration.',
          estimatedDuration: '6-7 weeks',
          difficulty: 'Intermediate',
          prerequisites: ['React.js Development'],
          resources: [
            {
              type: 'course',
              title: 'Node.js & Express Masterclass',
              description: 'Complete backend development with Node.js'
            }
          ],
          skills: ['Node.js', 'Express.js', 'RESTful APIs', 'Database Integration'],
          projects: ['REST API', 'Authentication System', 'Real-time Chat App'],
          isCompleted: false,
          completionCriteria: ['Build secure APIs', 'Implement authentication', 'Handle database operations']
        },
        {
          id: 'step_5',
          title: 'Database Design & Management',
          description: 'Master database concepts with MongoDB and PostgreSQL, including data modeling and optimization.',
          estimatedDuration: '4-5 weeks',
          difficulty: 'Intermediate',
          prerequisites: ['Backend Development with Node.js'],
          resources: [
            {
              type: 'course',
              title: 'Database Design Fundamentals',
              description: 'Learn SQL and NoSQL database design'
            }
          ],
          skills: ['MongoDB', 'PostgreSQL', 'Data Modeling', 'Query Optimization'],
          projects: ['Database Schema Design', 'Data Migration Scripts'],
          isCompleted: false,
          completionCriteria: ['Design efficient schemas', 'Write optimized queries', 'Handle data relationships']
        }
      ]
    },
    {
      id: 'roadmap_2',
      title: 'Machine Learning Engineer Path',
      description: 'Transform into an ML engineer with hands-on projects and industry practices',
      category: 'Data Science',
      totalDuration: '8-10 months',
      difficulty: 'Advanced',
      tags: ['Python', 'TensorFlow', 'MLOps', 'Deep Learning'],
      createdAt: '2024-01-10',
      lastUpdated: '2024-01-15',
      isFavorite: false,
      collaborationCount: 89,
      steps: [
        {
          id: 'ml_step_1',
          title: 'Python & Data Science Foundations',
          description: 'Master Python programming and essential data science libraries.',
          estimatedDuration: '4-5 weeks',
          difficulty: 'Beginner',
          prerequisites: [],
          resources: [],
          skills: ['Python', 'NumPy', 'Pandas', 'Matplotlib'],
          projects: ['Data Analysis Project', 'Visualization Dashboard'],
          isCompleted: false,
          completionCriteria: ['Manipulate data with Pandas', 'Create visualizations', 'Statistical analysis']
        }
      ]
    }
  ]);

  const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed' | 'favorite'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleStepCompletion = (roadmapId: string, stepId: string) => {
    setRoadmaps(prev => prev.map(roadmap => {
      if (roadmap.id === roadmapId) {
        return {
          ...roadmap,
          steps: roadmap.steps.map(step => {
            if (step.id === stepId) {
              const isCompleting = !step.isCompleted;
              return {
                ...step,
                isCompleted: isCompleting,
                completedAt: isCompleting ? new Date().toISOString().split('T')[0] : undefined,
                timeSpent: isCompleting ? `${Math.floor(Math.random() * 30) + 10} hours` : undefined
              };
            }
            return step;
          }),
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return roadmap;
    }));
  };

  const toggleFavorite = (roadmapId: string) => {
    setRoadmaps(prev => prev.map(roadmap => 
      roadmap.id === roadmapId 
        ? { ...roadmap, isFavorite: !roadmap.isFavorite }
        : roadmap
    ));
  };

  const startQuiz = (stepId: string) => {
    alert(`Starting quiz for step ${stepId}`);
  };

  const getProgressPercentage = (roadmap: Roadmap) => {
    const completedSteps = roadmap.steps.filter(step => step.isCompleted).length;
    return Math.round((completedSteps / roadmap.steps.length) * 100);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const filteredRoadmaps = roadmaps.filter(roadmap => {
    const matchesSearch = roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         roadmap.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         roadmap.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = () => {
      switch (filter) {
        case 'in-progress':
          return roadmap.steps.some(step => step.isCompleted) && 
                 roadmap.steps.some(step => !step.isCompleted);
        case 'completed':
          return roadmap.steps.every(step => step.isCompleted);
        case 'favorite':
          return roadmap.isFavorite;
        default:
          return true;
      }
    };

    return matchesSearch && matchesFilter();
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <ClipboardListIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Learning Roadmaps
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Track your progress and achieve your learning goals with structured roadmaps
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search roadmaps, skills, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all text-black"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <FilterIcon className="w-5 h-5 text-gray-500" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all text-black"
            >
              <option value="all">All Roadmaps</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="favorite">Favorites</option>
            </select>
          </div>
        </div>
      </div>

      {/* Roadmaps Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {filteredRoadmaps.map((roadmap) => (
          <div key={roadmap.id} className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            {/* Roadmap Header */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">{roadmap.title}</h2>
                    <button
                      onClick={() => toggleFavorite(roadmap.id)}
                      className={`p-1 rounded-full transition-all ${
                        roadmap.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                      }`}
                    >
                      <StarIcon className={`w-5 h-5 ${roadmap.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <p className="text-gray-600 mb-3">{roadmap.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {roadmap.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-white text-blue-600 text-sm rounded-lg shadow-sm border border-blue-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Roadmap Stats */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">{roadmap.totalDuration}</span>
                </div>
                <div className={`px-3 py-1 rounded-lg text-sm font-medium border ${getDifficultyColor(roadmap.difficulty)}`}>
                  <TrendingUpIcon className="w-4 h-4 inline mr-1" />
                  {roadmap.difficulty}
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpenIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">{roadmap.steps.length} Steps</span>
                </div>
                {roadmap.collaborationCount && (
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700">{roadmap.collaborationCount} learners</span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-bold text-blue-600">{getProgressPercentage(roadmap)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${getProgressPercentage(roadmap)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{roadmap.steps.filter(step => step.isCompleted).length} of {roadmap.steps.length} completed</span>
                  <span>Updated {new Date(roadmap.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Steps Preview/Full View */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Learning Steps</h3>
                <button
                  onClick={() => setSelectedRoadmap(selectedRoadmap === roadmap.id ? null : roadmap.id)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  {selectedRoadmap === roadmap.id ? 'Hide Details' : 'View Details'}
                </button>
              </div>

              {selectedRoadmap === roadmap.id ? (
                /* Detailed Steps View */
                <div className="space-y-4">
                  {roadmap.steps.map((step, index) => (
                    <div key={step.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => toggleStepCompletion(roadmap.id, step.id)}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                              step.isCompleted
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 hover:border-green-400'
                            }`}
                          >
                            {step.isCompleted && <CheckIcon className="w-4 h-4" />}
                          </button>
                        </div>
                        
                        <div className="flex-grow space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            <h4 className={`font-semibold ${step.isCompleted ? 'text-green-700' : 'text-gray-800'}`}>
                              Step {index + 1}: {step.title}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(step.difficulty)}`}>
                                {step.difficulty}
                              </span>
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                {step.estimatedDuration}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>

                          {/* Skills & Projects */}
                          {(step.skills.length > 0 || step.projects.length > 0) && (
                            <div className="grid md:grid-cols-2 gap-3">
                              {step.skills.length > 0 && (
                                <div className="space-y-2">
                                  <h5 className="font-medium text-gray-700 text-sm flex items-center">
                                    <TargetIcon className="w-3 h-3 mr-1 text-green-500" />
                                    Skills
                                  </h5>
                                  <div className="flex flex-wrap gap-1">
                                    {step.skills.slice(0, 3).map((skill, idx) => (
                                      <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                                        {skill}
                                      </span>
                                    ))}
                                    {step.skills.length > 3 && (
                                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                                        +{step.skills.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {step.projects.length > 0 && (
                                <div className="space-y-2">
                                  <h5 className="font-medium text-gray-700 text-sm flex items-center">
                                    <BookOpenIcon className="w-3 h-3 mr-1 text-blue-500" />
                                    Projects
                                  </h5>
                                  <div className="space-y-1">
                                    {step.projects.slice(0, 2).map((project, idx) => (
                                      <div key={idx} className="text-xs text-gray-600 flex items-center">
                                        <ArrowRightIcon className="w-2 h-2 mr-1 text-gray-400" />
                                        {project}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Completion Info */}
                          {step.isCompleted && step.completedAt && (
                            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2 text-green-700">
                                  <AwardIcon className="w-4 h-4" />
                                  <span className="font-medium">Completed</span>
                                </div>
                                <div className="text-green-600 text-xs space-x-4">
                                  <span>📅 {new Date(step.completedAt).toLocaleDateString()}</span>
                                  {step.timeSpent && <span>⏱️ {step.timeSpent}</span>}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => toggleStepCompletion(roadmap.id, step.id)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                                  step.isCompleted 
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}
                              >
                                {step.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                              </button>
                              
                              <button 
                                onClick={() => startQuiz(step.id)}
                                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-200 transition-all"
                              >
                                <PlayIcon className="w-3 h-3 inline mr-1" />
                                Quiz
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Steps Overview */
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {roadmap.steps.slice(0, 6).map((step, index) => (
                    <div key={step.id} className={`p-3 rounded-lg border text-center ${
                      step.isCompleted 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className={`w-6 h-6 mx-auto mb-2 rounded-full flex items-center justify-center ${
                        step.isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {step.isCompleted ? <CheckIcon className="w-3 h-3" /> : index + 1}
                      </div>
                      <p className="text-xs font-medium text-gray-700 truncate">{step.title}</p>
                    </div>
                  ))}
                  {roadmap.steps.length > 6 && (
                    <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 text-center">
                      <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center">
                        <PlusIcon className="w-3 h-3" />
                      </div>
                      <p className="text-xs font-medium text-gray-700">+{roadmap.steps.length - 6} more</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {roadmap.collaborators && (
                  <div className="flex -space-x-2">
                    {roadmap.collaborators.slice(0, 3).map((collab, idx) => (
                      <img 
                        key={idx}
                        src={collab.avatar} 
                        alt={collab.name}
                        className="w-6 h-6 rounded-full border-2 border-white"
                        title={collab.name}
                      />
                    ))}
                  </div>
                )}
                <span className="text-sm text-gray-600">
                  Last updated {new Date(roadmap.lastUpdated).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <ShareIcon className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-green-600 transition-colors">
                  <DownloadIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRoadmaps.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <ClipboardListIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No roadmaps found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all">
            Create Your First Roadmap
          </button>
        </div>
      )}
    </div>
  );
};


