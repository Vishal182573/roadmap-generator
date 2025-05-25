"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSession, useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';

type AuthMode = 'signup' | 'login';
type UserType = 'student' | 'mentor';

const AuthForm: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [userType, setUserType] = useState<UserType>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expertiseFields, setExpertiseFields] = useState(['']);
  const [qualificationFields, setQualificationFields] = useState(['']);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    expertise: [''],
    qualifications: [''],
    institution: '',
    description: '',
    hourlyRate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExpertiseChange = (index: number, value: string) => {
    const updatedExpertise = [...expertiseFields];
    updatedExpertise[index] = value;
    setExpertiseFields(updatedExpertise);
    
    setFormData(prev => ({
      ...prev,
      expertise: updatedExpertise
    }));
  };

  const handleQualificationChange = (index: number, value: string) => {
    const updatedQualifications = [...qualificationFields];
    updatedQualifications[index] = value;
    setQualificationFields(updatedQualifications);
    
    setFormData(prev => ({
      ...prev,
      qualifications: updatedQualifications
    }));
  };

  const addExpertiseField = () => {
    setExpertiseFields([...expertiseFields, '']);
  };

  const addQualificationField = () => {
    setQualificationFields([...qualificationFields, '']);
  };

  const removeExpertiseField = (index: number) => {
    if (expertiseFields.length > 1) {
      const updatedFields = expertiseFields.filter((_, i) => i !== index);
      setExpertiseFields(updatedFields);
      
      setFormData(prev => ({
        ...prev,
        expertise: updatedFields
      }));
    }
  };

  const removeQualificationField = (index: number) => {
    if (qualificationFields.length > 1) {
      const updatedFields = qualificationFields.filter((_, i) => i !== index);
      setQualificationFields(updatedFields);
      
      setFormData(prev => ({
        ...prev,
        qualifications: updatedFields
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // Basic validation
    if (authMode === 'signup' && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    // Validation for mentor fields in signup mode
    if (authMode === 'signup' && userType === 'mentor') {
      // Filter out empty fields
      const filteredExpertise = expertiseFields.filter(item => item.trim() !== '');
      const filteredQualifications = qualificationFields.filter(item => item.trim() !== '');
      
      if (filteredExpertise.length === 0) {
        setError('At least one area of expertise is required');
        setIsLoading(false);
        return;
      }
      
      if (filteredQualifications.length === 0) {
        setError('At least one qualification is required');
        setIsLoading(false);
        return;
      }
      
      if (!formData.institution.trim()) {
        setError('Institution/Company is required');
        setIsLoading(false);
        return;
      }
      
      if (!formData.description.trim()) {
        setError('Description is required');
        setIsLoading(false);
        return;
      }
    }

    try {
      if (authMode === 'login') {
        // Use the login function from context
        await login(formData.email, formData.password);
        router.push('/'); // Redirect to dashboard after successful login
      } else {
        // Prepare request data for signup
        const requestData = {
          ...formData,
          role: userType,
          expertise: expertiseFields.filter(item => item.trim() !== ''),
          qualifications: qualificationFields.filter(item => item.trim() !== ''),
          hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : 0,
          profileImage: profileImage || undefined
        };

        // Send signup request
        const response = await fetch('/api/auth?type=signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Signup failed');
        }

        // After successful signup, log the user in using the same credentials
        await login(formData.email, formData.password);
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if already authenticated
  React.useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signup' ? 'login' : 'signup');
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {authMode === 'signup' ? 'Sign Up' : 'Log In'}
          </CardTitle>
          {authMode === 'signup' && (
            <div className="flex justify-center mt-4 space-x-4">
              <Button
                variant={userType === 'student' ? 'default' : 'outline'}
                onClick={() => setUserType('student')}
              >
                Student
              </Button>
              <Button
                variant={userType === 'mentor' ? 'default' : 'outline'}
                onClick={() => setUserType('mentor')}
              >
                Mentor
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <>
                {/* Image Upload */}
                <div>
                  <Label htmlFor="profileImage">Profile Photo</Label>
                  <Input
                    id="profileImage"
                    name="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      className="mt-2 w-24 h-24 rounded-full object-cover border"
                    />
                  )}
                </div>
              </>
            )}

            {authMode === 'signup' && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
              />
            </div>

            {userType === 'student' && authMode === 'signup' && (
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  name="studentId"
                  type="text"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  placeholder="Enter your student ID"
                />
              </div>
            )}

            {userType === 'mentor' && authMode === 'signup' && (
              <>
                {/* Expertise Section */}
                <div className="space-y-2">
                  <Label>Area of Expertise</Label>
                  {expertiseFields.map((field, index) => (
                    <div key={`expertise-${index}`} className="flex space-x-2">
                      <Input
                        value={field}
                        onChange={(e) => handleExpertiseChange(index, e.target.value)}
                        placeholder="e.g., Machine Learning, Web Development"
                        required={index === 0}
                      />
                      {index > 0 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={() => removeExpertiseField(index)}
                        >
                          -
                        </Button>
                      )}
                      {index === expertiseFields.length - 1 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={addExpertiseField}
                        >
                          +
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Qualifications Section */}
                <div className="space-y-2">
                  <Label>Qualifications</Label>
                  {qualificationFields.map((field, index) => (
                    <div key={`qualification-${index}`} className="flex space-x-2">
                      <Input
                        value={field}
                        onChange={(e) => handleQualificationChange(index, e.target.value)}
                        placeholder="e.g., PhD in Computer Science, Stanford University"
                        required={index === 0}
                      />
                      {index > 0 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={() => removeQualificationField(index)}
                        >
                          -
                        </Button>
                      )}
                      {index === qualificationFields.length - 1 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={addQualificationField}
                        >
                          +
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <Label htmlFor="institution">Institution/Company</Label>
                  <Input
                    id="institution"
                    name="institution"
                    type="text"
                    value={formData.institution}
                    onChange={handleInputChange}
                    required
                    placeholder="Your workplace or institution"
                  />
                </div>

                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    placeholder="Your hourly rate"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Professional Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Brief description of your professional background"
                    rows={3}
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
              />
            </div>

            {authMode === 'signup' && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="Confirm your password"
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : authMode === 'signup' ? 'Create Account' : 'Log In'}
            </Button>

            <div className="text-center mt-4">
              <Button 
                type="button" 
                variant="link"
                onClick={toggleAuthMode}
              >
                {authMode === 'signup' 
                  ? 'Already have an account? Log In' 
                  : 'Don\'t have an account? Sign Up'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;