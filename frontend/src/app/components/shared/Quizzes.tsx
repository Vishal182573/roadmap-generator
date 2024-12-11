"use client"
import React, { useState, ChangeEvent } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

// Define the quiz data structure
type QuizQuestionType = 'multiple-choice' | 'text' | 'checkbox';

interface QuizQuestion {
  id: number;
  type: QuizQuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
}

// Sample quiz questions
const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    type: 'multiple-choice',
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 'Paris'
  },
  {
    id: 2,
    type: 'text',
    question: 'Who painted the Mona Lisa?',
    correctAnswer: 'Leonardo da Vinci'
  },
  {
    id: 3,
    type: 'checkbox',
    question: 'Which of these are programming languages?',
    options: ['Python', 'HTML', 'Java', 'CSS'],
    correctAnswer: ['Python', 'Java']
  }
];

const Quiz: React.FC = () => {
  const [answers, setAnswers] = useState<{[key: number]: string | string[]}>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleMultipleChoice = (questionId: number, value: string) => {
    setAnswers(prev => ({...prev, [questionId]: value}));
  };

  const handleTextInput = (questionId: number, event: ChangeEvent<HTMLInputElement>) => {
    setAnswers(prev => ({...prev, [questionId]: event.target.value}));
  };

  const handleCheckbox = (questionId: number, value: string) => {
    setAnswers(prev => {
      const currentAnswers = Array.isArray(prev[questionId]) 
        ? prev[questionId] as string[] 
        : [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(ans => ans !== value)
        : [...currentAnswers, value];
      return {...prev, [questionId]: newAnswers};
    });
  };

  const calculateScore = () => {
    let currentScore = 0;
    quizQuestions.forEach(question => {
      const userAnswer = answers[question.id];
      if (
        (question.type === 'multiple-choice' && userAnswer === question.correctAnswer) ||
        (question.type === 'text' && 
         userAnswer && 
         String(userAnswer).trim().toLowerCase() === String(question.correctAnswer).toLowerCase()) ||
        (question.type === 'checkbox' && 
         JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer))
      ) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setSubmitted(true);
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-4">
        <CardTitle className="text-2xl font-bold text-center text-blue-800">
          Interactive Quiz Challenge
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {!submitted ? (
          <>
            {quizQuestions.map((q) => (
              <div key={q.id} className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                <Label className="text-lg font-semibold text-gray-800 mb-3 block">
                  {q.question}
                </Label>
                
                {q.type === 'multiple-choice' && (
                  <RadioGroup 
                    onValueChange={(value) => handleMultipleChoice(q.id, value)}
                    className="space-y-2"
                  >
                    {q.options?.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${q.id}-${option}`} />
                        <Label htmlFor={`${q.id}-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                
                {q.type === 'text' && (
                  <Input 
                    type="text" 
                    placeholder="Your answer" 
                    onChange={(e) => handleTextInput(q.id, e)}
                    className="w-full"
                  />
                )}
                
                {q.type === 'checkbox' && (
                  <div className="space-y-2">
                    {q.options?.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`${q.id}-${option}`}
                          onCheckedChange={(checked) => 
                            handleCheckbox(q.id, option)
                          }
                        />
                        <Label
                          htmlFor={`${q.id}-${option}`}
                          className="text-sm font-medium"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <Button 
              onClick={calculateScore} 
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Submit Quiz
            </Button>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Quiz Results
            </h2>
            <p className="text-xl mb-6">
              Your Score: {score} / {quizQuestions.length}
            </p>
            <Button 
              onClick={resetQuiz} 
              className="bg-green-600 hover:bg-green-700"
            >
              Retake Quiz
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Quiz;