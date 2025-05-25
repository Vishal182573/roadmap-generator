"use client"
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Check,
  Loader2,
  Calendar,
  Clock,
  Bookmark
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
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
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Mentor Interface
interface Mentor {
  _id: string;
  name: string;
  profileImage: string;
  expertise: string[];
  qualifications: string[];
  institution: string;
  studentsmentored: number;
  rating: number;
  hourlyRate: number;
  description: string;
}

// API response interface
interface ApiResponse {
  success: boolean;
  data: Mentor[];
  message?: string;
  total: number;
}

const MentorPage: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'students' | 'rate'>('rating');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expertiseOptions, setExpertiseOptions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;
  
  // Function to fetch mentors from API
  const fetchMentors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query URL with search parameters
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.set('search', searchTerm);
      if (selectedExpertise && selectedExpertise !== 'all') queryParams.set('expertise', selectedExpertise);
      queryParams.set('sortBy', sortBy);
      queryParams.set('page', currentPage.toString());
      queryParams.set('limit', itemsPerPage.toString());
      
      const url = `/api/mentors?${queryParams.toString()}`;
      console.log('Fetching mentors from:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const result: ApiResponse = await response.json();
      console.log('API Response:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch mentors');
      }
      
      console.log('Setting mentors:', result.data.length);
      setMentors(result.data);
      setTotalPages(Math.ceil(result.total / itemsPerPage));
      
      // Extract unique expertise options
      const allExpertise = new Set<string>();
      result.data.forEach(mentor => {
        mentor.expertise.forEach(exp => allExpertise.add(exp));
      });
      
      setExpertiseOptions(Array.from(allExpertise));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error fetching mentors:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch on component mount
  useEffect(() => {
    fetchMentors();
  }, [currentPage]);
  
  // Re-fetch when search parameters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when filters change
      fetchMentors();
    }, 500); // Debounce for better performance
    
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedExpertise, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-blue-900 mb-4 animate-fade-in">
            Find Your Perfect Mentor
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg animate-fade-in-delayed">
            Connect with industry experts who will guide you through your learning journey and help you achieve your goals
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white shadow-lg rounded-xl p-6 border border-blue-100 transform hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search mentors by name or expertise" 
                className="pl-10 focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select 
              value={selectedExpertise} 
              onValueChange={setSelectedExpertise}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter Expertise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Expertise</SelectItem>
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
              <SelectTrigger className="w-full md:w-[150px]">
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

        {/* Loading State with Skeletons */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="overflow-hidden animate-pulse">
                <CardHeader className="pb-0">
                  <div className="flex justify-center">
                    <Skeleton className="w-32 h-32 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <Skeleton className="h-8 w-48 mx-auto" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex justify-between mt-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 mb-6 shadow-md animate-fade-in">
            <h3 className="font-semibold text-lg mb-2">Error loading mentors</h3>
            <p className="mb-4">{error}</p>
            <Button 
              className="mt-2" 
              variant="outline" 
              onClick={fetchMentors}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Mentors Grid */}
        {!loading && !error && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {mentors.length} {mentors.length === 1 ? 'mentor' : 'mentors'}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor, index) => (
                <Card 
                  key={mentor._id} 
                  className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white overflow-hidden border border-blue-100 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="relative pb-0">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute top-4 right-4 flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-full">
                            <Star className="text-yellow-500 fill-yellow-500 h-4 w-4" />
                            <span className="font-bold text-yellow-700">{mentor.rating}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Average rating from {Math.floor(mentor.studentsmentored * 0.8)} reviews</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <div className="relative mx-auto">
                      <img 
                        src={mentor.profileImage || '/placeholder-avatar.png'} 
                        alt={mentor.name}
                        className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-blue-200 mb-3"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-avatar.png';
                        }}
                      />
                      <Badge className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600">
                        {mentor.institution}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <h2 className="text-2xl font-bold text-center mb-2 text-blue-900">
                      {mentor.name}
                    </h2>
                    <p className="text-center text-gray-600 mb-4 text-sm line-clamp-2">
                      {mentor.description}
                    </p>

                    <div className="space-y-4 mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <BookOpen className="text-blue-500" size={18} />
                          <span className="font-medium">Expertise</span>
                        </div>
                        <div className="flex flex-wrap gap-1 ml-6">
                          {mentor.expertise.map(exp => (
                            <Badge 
                              key={exp} 
                              variant="secondary" 
                              className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
                              onClick={() => setSelectedExpertise(exp)}
                            >
                              {exp}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <GraduationCap className="text-green-600" size={18} />
                          <span className="font-medium">Qualifications</span>
                        </div>
                        <div className="ml-6">
                          {mentor.qualifications.map(qual => (
                            <div key={qual} className="text-sm text-gray-700">
                              • {qual}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="text-purple-600" size={18} />
                          <span className="font-medium">Students Mentored</span>
                        </div>
                        <div className="font-bold text-purple-700">{mentor.studentsmentored}</div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="bg-gray-50 border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center space-x-2">
                        <Clock className="text-blue-600" size={18} />
                        <span className="font-bold text-blue-900">${mentor.hourlyRate}/hr</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-blue-200 hover:bg-blue-50"
                          onClick={() => alert(`${mentor.name} added to saved mentors`)}
                        >
                          <Bookmark size={16} className="mr-1" />
                          Save
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                          onClick={() => window.location.href = `/bookSession/${mentor._id}`}
                        >
                          <Calendar size={16} className="mr-1" />
                          Book
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {!loading && !error && mentors.length === 0 && (
          <div className="text-center bg-white rounded-lg shadow-md p-10 border border-blue-100 animate-fade-in">
            <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
              <Search className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-blue-900">No mentors found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any mentors matching your search criteria. Try adjusting your filters or search terms.
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedExpertise('all');
              setSortBy('rating');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
        
        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-blue-900 mb-3">Are you an expert in your field?</h3>
          <p className="text-gray-600 mb-6">Join our platform as a mentor and share your knowledge with eager students</p>
          <Button 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8 py-6 h-auto"
            onClick={() => window.location.href = '/become-mentor'}
          >
            Become a Mentor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MentorPage;