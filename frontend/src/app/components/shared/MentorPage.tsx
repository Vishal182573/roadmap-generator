"use client"
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Check 
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Mentor Interface
interface Mentor {
  id: number;
  name: string;
  profileImage: string;
  expertise: string[];
  qualifications: string[];
  studentsmentored: number;
  rating: number;
  hourlyRate: number;
  description: string;
}

// Sample Mentor Data
const mentorsData: Mentor[] = [
  {
    id: 1,
    name: 'Dr. Emily Rodriguez',
    profileImage: '/api/placeholder/200/200',
    expertise: ['Machine Learning', 'Data Science', 'AI Ethics'],
    qualifications: ['PhD in Computer Science', 'Stanford University'],
    studentsmentored: 150,
    rating: 4.8,
    hourlyRate: 75,
    description: 'Passionate AI researcher with 10+ years of industry experience.'
  },
  {
    id: 2,
    name: 'Alex Thompson',
    profileImage: '/api/placeholder/200/200',
    expertise: ['Web Development', 'React', 'Node.js'],
    qualifications: ['MSc in Software Engineering', 'MIT'],
    studentsmentored: 200,
    rating: 4.9,
    hourlyRate: 65,
    description: 'Full-stack developer and technology enthusiast.'
  },
  // More mentors can be added here
];

const MentorPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'students' | 'rate'>('rating');

  // Expertise Options
  const expertiseOptions = [
    ...new Set(mentorsData.flatMap(mentor => mentor.expertise))
  ];

  // Filtered and Sorted Mentors
  const filteredMentors = useMemo(() => {
    return mentorsData
      .filter(mentor => 
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise.some(exp => 
          exp.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .filter(mentor => 
        !selectedExpertise || 
        mentor.expertise.includes(selectedExpertise)
      )
      .sort((a, b) => {
        switch(sortBy) {
          case 'rating': return b.rating - a.rating;
          case 'students': return b.studentsmentored - a.studentsmentored;
          case 'rate': return a.hourlyRate - b.hourlyRate;
        }
      });
  }, [searchTerm, selectedExpertise, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Discover Expert Mentors
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with top-tier professionals who can guide your learning journey
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white shadow-lg rounded-xl p-6">
          <div className="flex space-x-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search mentors by name or expertise" 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select 
              value={selectedExpertise} 
              onValueChange={setSelectedExpertise}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Expertise" />
              </SelectTrigger>
              <SelectContent>
                {expertiseOptions.map(expertise => (
                  <SelectItem key={expertise} value={expertise}>
                    {expertise}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={sortBy} 
              onValueChange={(value: 'rating' | 'students' | 'rate') => setSortBy(value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="students">Most Mentored</SelectItem>
                <SelectItem value="rate">Lowest Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map(mentor => (
            <Card 
              key={mentor.id} 
              className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <CardHeader className="relative">
                <div className="absolute top-4 right-4 flex items-center space-x-1">
                  <Star className="text-yellow-500 fill-yellow-500" />
                  <span className="font-bold">{mentor.rating}</span>
                </div>
                <img 
                  src={mentor.profileImage} 
                  alt={mentor.name}
                  className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-blue-200"
                />
              </CardHeader>
              <CardContent>
                <h2 className="text-2xl font-bold text-center mb-2">
                  {mentor.name}
                </h2>
                <p className="text-center text-gray-600 mb-4">
                  {mentor.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="text-blue-500" size={20} />
                      <span>Expertise</span>
                    </div>
                    <div className="flex space-x-1">
                      {mentor.expertise.map(exp => (
                        <Badge key={exp} variant="secondary">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="text-green-500" size={20} />
                      <span>Qualifications</span>
                    </div>
                    <div className="text-right">
                      {mentor.qualifications.map(qual => (
                        <div key={qual} className="text-sm text-gray-600">
                          {qual}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="text-purple-500" size={20} />
                      <span>Students Mentored</span>
                    </div>
                    <div className="font-bold">{mentor.studentsmentored}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Check className="text-green-600" />
                    <span>${mentor.hourlyRate}/hr</span>
                  </div>
                  <Button>Book Session</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            No mentors found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorPage;