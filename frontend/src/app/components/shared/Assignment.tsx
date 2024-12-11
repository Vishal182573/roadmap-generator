"use client"
import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Clock, 
  FileText, 
  Plus, 
  Calendar, 
  Tag, 
  CheckCircle2, 
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Assignment Interface
interface Assignment {
  id: number;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  attachments?: string[];
  maxScore: number;
}

// Sample Assignment Data
const assignmentsData: Assignment[] = [
  {
    id: 1,
    title: 'Machine Learning Project',
    subject: 'Data Science',
    description: 'Develop a predictive model using Python and scikit-learn',
    dueDate: '2024-02-15',
    status: 'Pending',
    difficulty: 'Hard',
    attachments: ['dataset.csv', 'project_guidelines.pdf'],
    maxScore: 100
  },
  {
    id: 2,
    title: 'Web Development Portfolio',
    subject: 'Web Technologies',
    description: 'Create a responsive personal portfolio website',
    dueDate: '2024-01-30',
    status: 'Completed',
    difficulty: 'Medium',
    maxScore: 80
  },
  // More assignments can be added
];

const AssignmentPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Dynamic Subject Options
  const subjectOptions = [
    ...new Set(assignmentsData.map(assignment => assignment.subject))
  ];

  // Filtered Assignments
  const filteredAssignments = useMemo(() => {
    return assignmentsData
      .filter(assignment => 
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(assignment => 
        !filterSubject || assignment.subject === filterSubject
      )
      .filter(assignment => 
        !filterStatus || assignment.status === filterStatus
      );
  }, [searchTerm, filterSubject, filterStatus]);

  // Calculate Assignment Stats
  const assignmentStats = useMemo(() => ({
    total: assignmentsData.length,
    pending: assignmentsData.filter(a => a.status === 'Pending').length,
    completed: assignmentsData.filter(a => a.status === 'Completed').length,
    overdue: assignmentsData.filter(a => a.status === 'Overdue').length
  }), [assignmentsData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">
            Assignment Hub
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track, manage, and submit your academic assignments efficiently
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: assignmentStats.total, icon: BookOpen, color: 'text-blue-500' },
            { label: 'Pending', value: assignmentStats.pending, icon: Clock, color: 'text-yellow-500' },
            { label: 'Completed', value: assignmentStats.completed, icon: CheckCircle2, color: 'text-green-500' },
            { label: 'Overdue', value: assignmentStats.overdue, icon: FileText, color: 'text-red-500' }
          ].map(({ label, value, icon: Icon, color }) => (
            <div 
              key={label} 
              className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4 hover:shadow-lg transition"
            >
              <div className={`${color} p-3 rounded-full bg-opacity-10`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{label} Assignments</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex space-x-4">
            <div className="relative flex-grow">
              <Input 
                placeholder="Search assignments" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <Select 
              value={filterSubject} 
              onValueChange={setFilterSubject}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjectOptions.map(subject => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filterStatus} 
              onValueChange={setFilterStatus}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                {['Pending', 'Completed', 'Overdue'].map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Assignments Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map(assignment => (
            <Dialog 
              key={assignment.id}
              open={selectedAssignment?.id === assignment.id}
              onOpenChange={(open) => 
                setSelectedAssignment(open ? assignment : null)
              }
            >
              <Card className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <CardHeader className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Tag className="text-indigo-500" />
                    <h2 className="text-xl font-bold">{assignment.title}</h2>
                  </div>
                  <Badge 
                    variant={
                      assignment.status === 'Completed' ? 'default' : 
                      assignment.status === 'Overdue' ? 'destructive' : 'secondary'
                    }
                  >
                    {assignment.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <BookOpen size={16} className="text-gray-500" />
                      <span>{assignment.subject}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-gray-500" />
                      <span>Due: {assignment.dueDate}</span>
                    </div>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </DialogTrigger>
                  </div>
                </CardContent>
              </Card>

              {/* Assignment Details Modal */}
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{assignment.title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Subject</Label>
                    <span className="col-span-3">{assignment.subject}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Description</Label>
                    <Textarea 
                      readOnly 
                      value={assignment.description} 
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Due Date</Label>
                    <span className="col-span-3">{assignment.dueDate}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Difficulty</Label>
                    <Badge variant="outline">{assignment.difficulty}</Badge>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Max Score</Label>
                    <span className="col-span-3">{assignment.maxScore}</span>
                  </div>
                  {assignment.attachments && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Attachments</Label>
                      <div className="col-span-3 space-y-1">
                        {assignment.attachments.map(attachment => (
                          <div 
                            key={attachment} 
                            className="text-sm text-blue-600 hover:underline cursor-pointer"
                          >
                            {attachment}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Download Attachments</Button>
                  <Button>Submit Assignment</Button>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            No assignments found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentPage;