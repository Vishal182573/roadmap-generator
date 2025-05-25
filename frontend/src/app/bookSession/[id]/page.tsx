"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  Clock, 
  GraduationCap, 
  BookOpen, 
  Users, 
  MessageSquare,
  CheckCircle,
  Bookmark,
  Share2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

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
  data: Mentor;
  message?: string;
}

const MentorDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Available time slots
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', 
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];
  
  useEffect(() => {
    const fetchMentor = async () => {
      if (!params.id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/mentors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: params.id }),
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch mentor details');
        }
        
        setMentor(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching mentor details:', err);
        
        // Use mock data when API fails
        setMentor(getMockMentor());
      } finally {
        setLoading(false);
      }
    };
    
    fetchMentor();
  }, [params.id]);
  
  // Mock mentor for development when API is not available
  const getMockMentor = (): Mentor => {
    return {
      _id: params.id as string,
      name: 'Dr. Jane Smith',
      profileImage: '/api/placeholder/200/200',
      expertise: ['Machine Learning', 'Data Science', 'Python', 'AI Ethics'],
      qualifications: ['PhD in Computer Science', 'MIT', 'Former Lead Data Scientist at Google'],
      institution: 'MIT',
      studentsmentored: 152,
      rating: 4.9,
      hourlyRate: 85,
      description: 'Experienced data scientist with 10+ years in the industry. I specialize in machine learning and AI applications.'
    };
  };
  
  const handleBookSession = async () => {
    if (!selectedDate || !selectedTime || !mentor) {
      alert('Please select both a date and time for your session');
      return;
    }
    
    try {
      // Create the meet object
      const meetData = {
        mentorId: mentor._id,
        meetDate: selectedDate,
        meetTime: selectedTime,
        status: 'scheduled',
        meetType: 'one-on-one',
        hourlyRate: mentor.hourlyRate
      };

      const response = await fetch('/api/meet/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(meetData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to book session');
      }

      // Show success message
      alert(`Session successfully booked with ${mentor.name} on ${selectedDate.toLocaleDateString()} at ${selectedTime}`);
      
      // Redirect to dashboard
      router.push('/dashboard/bookings');
    } catch (error) {
      console.error('Error booking session:', error);
      alert('Failed to book session. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-blue-800 font-medium">Loading mentor details...</p>
      </div>
    );
  }
  
  if (error || !mentor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="container mx-auto max-w-4xl">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Mentors
          </Button>
          
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Mentor Details</h2>
            <p className="text-gray-600 mb-6">{error || "Mentor information could not be found"}</p>
            <Button onClick={() => router.push('/mentors')}>
              View All Mentors
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto max-w-6xl">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => router.push('/mentors')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Mentors
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mentor Profile */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex flex-col md:flex-row items-center">
                  <img 
                    src={mentor.profileImage} 
                    alt={mentor.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white mb-4 md:mb-0 md:mr-6"
                  />
                  <div>
                    <div className="flex items-center mb-2">
                      <h1 className="text-3xl font-bold mr-3">{mentor.name}</h1>
                      <Badge className="bg-yellow-500 text-yellow-900">{mentor.institution}</Badge>
                    </div>
                    <div className="flex items-center mb-2">
                      <Star className="fill-yellow-500 text-yellow-500 mr-1 h-5 w-5" />
                      <span className="font-bold mr-3">{mentor.rating} Rating</span>
                      <Users className="mr-1 h-5 w-5" />
                      <span>{mentor.studentsmentored} Students Mentored</span>
                    </div>
                    <p className="text-white/80">{mentor.description}</p>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <Tabs defaultValue="about">
                  <TabsList className="mb-6">
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="about" className="space-y-6">
                    {/* Expertise */}
                    <div>
                      <h3 className="text-lg font-semibold flex items-center mb-3">
                        <BookOpen className="text-blue-500 mr-2" />
                        Areas of Expertise
                      </h3>
                      <div className="flex flex-wrap gap-2 ml-7">
                        {mentor.expertise.map(exp => (
                          <Badge key={exp} variant="secondary" className="bg-blue-50 text-blue-700">
                            {exp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Qualifications */}
                    <div>
                      <h3 className="text-lg font-semibold flex items-center mb-3">
                        <GraduationCap className="text-green-600 mr-2" />
                        Qualifications & Experience
                      </h3>
                      <ul className="space-y-2 ml-7 text-gray-700">
                        {mentor.qualifications.map((qual, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="text-green-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                            <span>{qual}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Session Information */}
                    <div>
                      <h3 className="text-lg font-semibold flex items-center mb-3">
                        <MessageSquare className="text-purple-600 mr-2" />
                        Session Information
                      </h3>
                      <div className="bg-purple-50 p-4 rounded-lg ml-7">
                        <p className="text-gray-700 mb-3">
                          Sessions with {mentor.name} typically focus on:
                        </p>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start">
                            <CheckCircle className="text-purple-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                            <span>Personalized learning plans based on your goals</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="text-purple-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                            <span>Practical projects and real-world applications</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="text-purple-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                            <span>Career guidance and industry insights</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="text-purple-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                            <span>60-minute intensive learning sessions</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="sessions" className="space-y-4">
                    <h3 className="text-lg font-semibold">Available Session Types</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="p-4 border-l-4 border-l-blue-500">
                        <h4 className="font-medium text-blue-800">One-on-One Mentoring</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Personal guidance tailored to your specific needs and goals
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-600 font-bold">${mentor.hourlyRate}/hr</span>
                          <Badge>Most Popular</Badge>
                        </div>
                      </Card>
                      
                      <Card className="p-4 border-l-4 border-l-green-500">
                        <h4 className="font-medium text-green-800">Project Review</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Get expert feedback and guidance on your ongoing projects
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-green-600 font-bold">${Math.round(mentor.hourlyRate * 1.2)}/hr</span>
                        </div>
                      </Card>
                      
                      <Card className="p-4 border-l-4 border-l-purple-500">
                        <h4 className="font-medium text-purple-800">Career Coaching</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Guidance on career paths, job applications, and interviews
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-purple-600 font-bold">${Math.round(mentor.hourlyRate * 1.1)}/hr</span>
                        </div>
                      </Card>
                      
                      <Card className="p-4 border-l-4 border-l-amber-500">
                        <h4 className="font-medium text-amber-800">5-Session Package</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Comprehensive mentoring package with 10% discount
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-amber-600 font-bold">${Math.round(mentor.hourlyRate * 5 * 0.9)} total</span>
                          <Badge variant="outline" className="border-amber-500 text-amber-700">Save 10%</Badge>
                        </div>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Student Reviews</h3>
                      <div className="flex items-center">
                        <Star className="fill-yellow-500 text-yellow-500 h-5 w-5" />
                        <span className="font-bold ml-1">{mentor.rating}</span>
                        <span className="text-gray-500 ml-1">({Math.floor(mentor.studentsmentored * 0.8)} reviews)</span>
                      </div>
                    </div>
                    
                    {/* Sample reviews */}
                    <div className="space-y-4">
                      <Card className="p-4">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium">Michael L.</div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                          "{mentor.name} helped me understand complex concepts in a way that was easy to grasp. The personalized approach really made a difference in my learning journey."
                        </p>
                      </Card>
                      
                      <Card className="p-4">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium">Sarah T.</div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                          "Incredible mentor! Not only did I learn the technical skills I needed, but I also gained valuable insights about the industry that helped me land my dream job."
                        </p>
                      </Card>
                      
                      <Card className="p-4">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium">Alex R.</div>
                          <div className="flex">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            ))}
                            {[...Array(1)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-gray-300" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                          "Very knowledgeable in their field. The sessions were informative, though sometimes moved a bit too quickly for me. Overall a good experience."
                        </p>
                      </Card>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      View All Reviews
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Booking Panel */}
          <div>
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-center">Book a Session</h2>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-blue-600" />
                    Select Date
                  </h3>
                  <div className="border rounded-md p-1">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => 
                        date < new Date() || 
                        date > new Date(new Date().setMonth(new Date().getMonth() + 2))
                      }
                      className="rounded-md border"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-blue-600" />
                    Select Time
                  </h3>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Session Fee:</span>
                    <span className="font-bold">${mentor.hourlyRate}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Platform Fee:</span>
                    <span className="font-bold">${1}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between">
                    <span className="font-bold text-blue-900">Total:</span>
                    <span className="font-bold text-blue-900">${mentor.hourlyRate+1}</span>
                  </div>
                </div>
                
                <Button className="w-full mb-3" size="lg" onClick={handleBookSession}>
                  Book Session
                </Button>
                
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" className="flex-1 mr-2">
                    <Bookmark className="mr-1 h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="mr-1 h-4 w-4" />
                    Share
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  By booking, you agree to our terms of service and cancellation policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDetailPage;