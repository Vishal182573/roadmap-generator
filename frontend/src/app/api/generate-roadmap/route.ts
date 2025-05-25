// app/api/generate-roadmap/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

export async function POST(request: NextRequest) {
  let query: string = ''; // Declare query outside try block
  
  try {
    const body = await request.json();
    query = body.query;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Invalid query parameter' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Create a comprehensive, step-by-step learning roadmap for "${query}". 

Please provide a detailed JSON response with the following structure:
{
  "title": "Complete roadmap title",
  "description": "Brief overview of what this roadmap covers",
  "category": "Main category (e.g., Programming, Design, Marketing)",
  "totalDuration": "Estimated total time (e.g., 6-8 months)",
  "difficulty": "Beginner/Intermediate/Advanced",
  "steps": [
    {
      "title": "Step title",
      "description": "Detailed description of what to learn in this step",
      "estimatedDuration": "Time needed for this step (e.g., 2-3 weeks)",
      "difficulty": "Beginner/Intermediate/Advanced",
      "prerequisites": ["List of prerequisites"],
      "resources": [
        {
          "type": "article/video/course/practice",
          "title": "Resource title",
          "description": "What this resource covers"
        }
      ],
      "skills": ["Skills gained in this step"],
      "projects": ["Practical projects to complete"],
      "completionCriteria": ["How to know you've mastered this step"]
    }
  ],
  "tags": ["Relevant tags for categorization"]
}

Requirements:
1. Create 8-12 detailed steps that build upon each other
2. Each step should be specific and actionable
3. Include practical projects for hands-on learning
4. Provide clear completion criteria for tracking progress
5. Suggest realistic timeframes
6. Include diverse resource types (articles, videos, courses, practice)
7. Make it suitable for someone starting from the specified level
8. Ensure logical progression from basics to advanced concepts

Make the roadmap comprehensive, practical, and trackable. Focus on real-world application and skill development.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    let roadmapData;
    try {
      // Try to parse the entire response as JSON first
      roadmapData = JSON.parse(text);
    } catch (e) {
      // If that fails, try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (jsonMatch) {
        roadmapData = JSON.parse(jsonMatch[1]);
      } else {
        // Last resort: try to find JSON-like content
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        if (jsonStart !== -1 && jsonEnd > jsonStart) {
          roadmapData = JSON.parse(text.slice(jsonStart, jsonEnd));
        } else {
          throw new Error('No valid JSON found in response');
        }
      }
    }

    // Generate unique IDs and set default values
    const processedRoadmap: GeneratedRoadmap = {
      id: `roadmap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...roadmapData,
      steps: roadmapData.steps.map((step: any, index: number) => ({
        id: `step_${index + 1}_${Math.random().toString(36).substr(2, 6)}`,
        ...step,
        isCompleted: false,
        prerequisites: step.prerequisites || [],
        resources: step.resources || [],
        skills: step.skills || [],
        projects: step.projects || [],
        completionCriteria: step.completionCriteria || []
      })),
      createdAt: new Date().toISOString(),
      tags: roadmapData.tags || []
    };

    return NextResponse.json({
      success: true,
      roadmap: processedRoadmap
    });

  } catch (error) {
    console.error('Error generating roadmap:', error);
    
    // Return a fallback roadmap in case of API failure
    const fallbackRoadmap: GeneratedRoadmap = {
      id: `roadmap_${Date.now()}_fallback`,
      title: `${query || 'Learning'} Learning Path`, // Add fallback for empty query
      description: `A structured approach to learning ${query || 'new skills'}`,
      category: 'General',
      totalDuration: '3-6 months',
      difficulty: 'Beginner',
      steps: [
        {
          id: 'step_1_basics',
          title: 'Fundamentals',
          description: `Learn the basic concepts and principles${query ? ` of ${query}` : ''}`,
          estimatedDuration: '2-3 weeks',
          difficulty: 'Beginner' as const,
          prerequisites: [],
          resources: [
            {
              type: 'article' as const,
              title: 'Getting Started Guide',
              description: 'Introduction to basic concepts'
            }
          ],
          skills: ['Basic understanding', 'Core concepts'],
          projects: ['Hello World project'],
          isCompleted: false,
          completionCriteria: ['Understand basic terminology', 'Complete introductory exercises']
        },
        {
          id: 'step_2_intermediate',
          title: 'Intermediate Concepts',
          description: `Dive deeper${query ? ` into ${query}` : ''} with practical applications`,
          estimatedDuration: '3-4 weeks',
          difficulty: 'Intermediate' as const,
          prerequisites: ['Fundamentals'],
          resources: [
            {
              type: 'course' as const,
              title: 'Intermediate Course',
              description: 'Advanced concepts and techniques'
            }
          ],
          skills: ['Intermediate techniques', 'Problem solving'],
          projects: ['Practical project'],
          isCompleted: false,
          completionCriteria: ['Build a functional project', 'Understand advanced concepts']
        },
        {
          id: 'step_3_advanced',
          title: 'Advanced Application',
          description: `Master advanced${query ? ` ${query}` : ''} techniques and best practices`,
          estimatedDuration: '4-6 weeks',
          difficulty: 'Advanced' as const,
          prerequisites: ['Fundamentals', 'Intermediate Concepts'],
          resources: [
            {
              type: 'practice' as const,
              title: 'Advanced Challenges',
              description: 'Complex problems and solutions'
            }
          ],
          skills: ['Expert-level knowledge', 'Best practices'],
          projects: ['Capstone project'],
          isCompleted: false,
          completionCriteria: ['Complete advanced project', 'Demonstrate mastery']
        }
      ],
      tags: [query?.toLowerCase() || 'learning'],
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      roadmap: fallbackRoadmap,
      fallback: true
    });
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to generate roadmaps.' },
    { status: 405 }
  );
}